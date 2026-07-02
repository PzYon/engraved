using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Users;
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

// End-to-end check of polymorphic response serialization through the real MVC pipeline:
// controller responses are declared as IEntry[]/IJournal[] and rely on the [JsonDerivedType]
// registrations, so this pins that runtime-type properties (e.g. GaugeEntry.Value,
// BaseJournal.UserRole) actually reach the client and no type discriminator leaks in.
public class ResponseSerializationShould
{
  private const string JwtSecret = "serialization-test-secret-long-enough-to-be-valid-0123";
  private const string UserName = "serialization@test.ch";

  private WebApplicationFactory<Program> _factory = null!;
  private HttpClient _client = null!;
  private string _journalId = null!;

  [OneTimeSetUp]
  public async Task OneTimeSetUp()
  {
    _factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
      {
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

        builder.ConfigureServices(services => services.RemoveAll<IHostedService>());
      }
    );

    _journalId = await SeedJournalWithEntry();

    _client = _factory.CreateClient();
    _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", CreateToken());
  }

  [OneTimeTearDown]
  public void OneTimeTearDown()
  {
    _client.Dispose();
    _factory.Dispose();
  }

  [Test]
  public async Task Include_RuntimeTypeProperties_When_Returning_Entries()
  {
    HttpResponseMessage response = await _client.GetAsync($"/api/entries/journal/{_journalId}");

    response.StatusCode.Should().Be(HttpStatusCode.OK);

    string json = await response.Content.ReadAsStringAsync();
    json.Should().Contain("\"value\":42.5", "GaugeEntry.Value is not on IEntry and must survive serialization");
    json.Should().NotContain("$type");
  }

  [Test]
  public async Task Include_RuntimeTypeProperties_When_Returning_Journals()
  {
    HttpResponseMessage response = await _client.GetAsync("/api/journals");

    response.StatusCode.Should().Be(HttpStatusCode.OK);

    string json = await response.Content.ReadAsStringAsync();
    json.Should().Contain("\"userRole\":", "BaseJournal.UserRole is not on IJournal and must survive serialization");
    json.Should().Contain("\"type\":\"Gauge\"");
    json.Should().NotContain("$type");
  }

  private async Task<string> SeedJournalWithEntry()
  {
    // seed through the app's own repository so the data lands in the database the app reads
    var repo = _factory.Services.GetRequiredService<IUnrestrictedRepository>();

    UpsertResult userResult = await repo.UpsertUser(new User { Name = UserName });

    UpsertResult journalResult = await repo.UpsertJournal(
      new GaugeJournal
      {
        Name = "Serialization Journal",
        UserId = userResult.EntityId,
        EditedOn = DateTime.UtcNow
      }
    );

    await repo.UpsertEntry(
      new GaugeEntry
      {
        ParentId = journalResult.EntityId,
        UserId = userResult.EntityId,
        Value = 42.5,
        DateTime = DateTime.UtcNow,
        EditedOn = DateTime.UtcNow
      }
    );

    return journalResult.EntityId;
  }

  private static string CreateToken()
  {
    var tokenHandler = new JwtSecurityTokenHandler();
    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, UserName)]),
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
