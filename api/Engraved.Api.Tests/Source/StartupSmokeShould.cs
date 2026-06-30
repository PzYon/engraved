using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Persistence.Mongo;
using Engraved.Persistence.Mongo.Tests;
using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using NUnit.Framework;

namespace Engraved.Api.Tests;

// Smoke test for the real Program.cs DI wiring - the one thing the unit/integration suites do not
// cover. It boots the actual application (against the ephemeral mongo instance), confirms it starts
// and serves a request, and pins that the repository seams resolve to the intended concrete types.
public class StartupSmokeShould
{
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
                ["Authentication:JwtSecret"] = "smoke-test-secret-long-enough-to-be-valid-0123456789"
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

    // unrestricted seam -> raw MongoRepository; user-restricted + narrow roles -> scoped repository
    services.GetRequiredService<IUnrestrictedRepository>().Should().BeOfType<MongoRepository>();
    services.GetRequiredService<IUserRestrictedRepository>().Should().BeOfType<UserScopedMongoRepository>();
    services.GetRequiredService<IJournalRepository>().Should().BeOfType<UserScopedMongoRepository>();

    // maintenance is inherently unrestricted, so it resolves to the raw MongoRepository
    services.GetRequiredService<IMaintenanceRepository>().Should().BeOfType<MongoRepository>();
  }
}
