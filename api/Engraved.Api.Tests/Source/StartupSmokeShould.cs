using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Journals.EditPermissions;
using Engraved.Core.Application.Persistence;
using Engraved.Persistence.Mongo;
using Engraved.Persistence.Mongo.Repositories;
using Engraved.TestUtils;
using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using NUnit.Framework;

namespace Engraved.Api.Tests;

// Smoke test for the real Program.cs DI wiring - the one thing the unit/integration suites do not
// cover. It boots the actual application (against the ephemeral mongo instance), confirms it starts
// and serves a request, and pins that the repository seams resolve to the intended concrete types.
public class StartupSmokeShould
{
  private const string JwtSecret = "smoke-test-secret-long-enough-to-be-valid-0123456789";

  private WebApplicationFactory<Program> _factory = null!;

  [SetUp]
  public void SetUp()
  {
    _factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
      {
        // "Development" skips Azure Monitor / OpenTelemetry; the app then uses the JWT auth path,
        // so we supply a secret. Point mongo at the shared ephemeral instance.
        builder.UseEnvironment("Development");
        builder.ConfigureAppConfiguration((_, config) =>
          {
            config.AddInMemoryCollection(
              new Dictionary<string, string?>
              {
                ["ConnectionStrings:engraved_db"] = Util.ConnectionString,
                ["Authentication:JwtSecret"] = JwtSecret
              }
            );
          }
        );

        // the background notification job is irrelevant to startup wiring (and would tick mongo).
        builder.ConfigureServices(services => services.RemoveAll<IHostedService>());
      }
    );
  }

  [TearDown]
  public void TearDown()
  {
    _factory.Dispose();
  }

  [Test]
  public async Task Start_And_Serve_HealthRequest()
  {
    HttpClient client = _factory.CreateClient();

    HttpResponseMessage response = await client.GetAsync("/");

    response.StatusCode.Should().Be(HttpStatusCode.OK);
  }

  [Test]
  public void Resolve_RepositorySeams_To_ExpectedConcreteTypes()
  {
    using IServiceScope scope = _factory.Services.CreateScope();
    IServiceProvider services = scope.ServiceProvider;

    // unrestricted seam -> raw UnrestrictedMongoRepository; the narrow roles -> the user-restricted
    // decorators (reads shaped by UserReadScope, writes guarded by JournalWriteGuard)
    services.GetRequiredService<IUnrestrictedRepository>().Should().BeOfType<UnrestrictedMongoRepository>();
    services.GetRequiredService<IUserRepository>().Should().BeOfType<UserRestrictedUserRepository>();
    services.GetRequiredService<IJournalRepository>().Should().BeOfType<UserRestrictedJournalRepository>();
    services.GetRequiredService<IEntryRepository>().Should().BeOfType<UserRestrictedEntryRepository>();

    // maintenance is inherently unrestricted, so it resolves to the raw UnrestrictedMongoRepository
    services.GetRequiredService<IMaintenanceRepository>().Should().BeOfType<UnrestrictedMongoRepository>();

    // the edit-permissions executor is the only one with a non-repository dependency
    // (PermissionsEnsurer); resolve it so a broken registration fails here and not at runtime
    services.GetRequiredService<ICommandExecutor<EditJournalPermissionsCommand>>();
  }

  [Test]
  public async Task Return_Unauthorized_For_ValidlySignedToken_Missing_NameIdClaim()
  {
    HttpClient client = _factory.CreateClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", CreateTokenWithoutNameIdClaim());

    // any [Authorize] endpoint works - the request must never reach the controller.
    HttpResponseMessage response = await client.GetAsync("/api/system_info");

    response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
  }

  [Test]
  public async Task Include_ActionDuration_Header_On_Responses()
  {
    HttpClient client = _factory.CreateClient();

    HttpResponseMessage response = await client.GetAsync("/");

    response.Headers.Contains("server-action-duration").Should().BeTrue();
  }

  private static string CreateTokenWithoutNameIdClaim()
  {
    var tokenHandler = new JwtSecurityTokenHandler();
    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity([new Claim(ClaimTypes.Name, "someone")]),
      Expires = DateTime.UtcNow.AddMinutes(5),
      SigningCredentials = new SigningCredentials(
        new SymmetricSecurityKey(Encoding.ASCII.GetBytes(JwtSecret)),
        SecurityAlgorithms.HmacSha256Signature
      )
    };

    SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
    return tokenHandler.WriteToken(token);
  }
}
