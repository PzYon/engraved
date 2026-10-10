using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Engraved.Api.Authentication;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
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

// Pins which user data leaves the API: everybody with access to a shared journal sees the other
// users on it, so those must only carry what is needed to display them, and refresh tokens must
// not reach any client, not even their owner's. The scratchpad is only served by its own endpoint.
public class UserDataInResponsesShould
{
  private const string JwtSecret = "user-data-test-secret-long-enough-to-be-valid-0123456";
  private const string OwnerName = "owner@user-data.test";
  private const string ReaderName = "reader@user-data.test";
  private const string ScratchpadContent = "owner's scratchpad";

  private static readonly string[] PublicUserProperties = ["id", "name", "displayName", "imageUrl"];

  private WebApplicationFactory<Program> _factory = null!;
  private HttpClient _ownerClient = null!;
  private HttpClient _readerClient = null!;
  private string _ownerId = null!;
  private string _journalId = null!;
  private string _ownerRefreshToken = null!;

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

    await SeedJournalSharedWithReader();

    _ownerClient = CreateClient(OwnerName);
    _readerClient = CreateClient(ReaderName);
  }

  [OneTimeTearDown]
  public void OneTimeTearDown()
  {
    _ownerClient.Dispose();
    _readerClient.Dispose();
    _factory.Dispose();
  }

  [Test]
  public async Task Expose_Only_PublicData_Of_Other_Users_When_Returning_Journal()
  {
    JsonElement journal = await GetJson(_readerClient, $"/api/journals/{_journalId}");

    GetPermissionUserProperties(journal, _ownerId).Should().BeEquivalentTo(PublicUserProperties);
    journal.GetRawText().Should().NotContain("tokenHash");
  }

  [Test]
  public async Task Expose_Only_PublicData_Of_Other_Users_When_Returning_Journals()
  {
    JsonElement journals = await GetJson(_readerClient, "/api/journals");

    JsonElement journal = journals.EnumerateArray().Single(j => j.GetProperty("id").GetString() == _journalId);
    GetPermissionUserProperties(journal, _ownerId).Should().BeEquivalentTo(PublicUserProperties);
    journals.GetRawText().Should().NotContain("tokenHash");
  }

  [Test]
  public async Task Not_Expose_RefreshTokens_When_Returning_Current_User()
  {
    JsonElement user = await GetJson(_ownerClient, "/api/user");

    user.TryGetProperty("favoriteJournalIds", out _).Should().BeTrue("own data is still returned");
    user.TryGetProperty("refreshTokens", out _).Should().BeFalse();
  }

  [Test]
  public async Task Not_Expose_RefreshTokens_Or_Scratchpad_When_Refreshing()
  {
    using HttpClient anonymousClient = _factory.CreateClient();

    HttpResponseMessage response = await anonymousClient.PostAsJsonAsync(
      "/api/auth/refresh",
      new RefreshPayload { RefreshToken = _ownerRefreshToken }
    );

    response.StatusCode.Should().Be(HttpStatusCode.OK);
    JsonElement authResult = await response.Content.ReadFromJsonAsync<JsonElement>();
    authResult.GetProperty("refreshToken").GetString().Should().NotBeNullOrEmpty();
    authResult.GetProperty("user").TryGetProperty("refreshTokens", out _).Should().BeFalse();
    authResult.GetProperty("user").TryGetProperty("scratchpad", out _).Should().BeFalse();
  }

  [Test]
  public async Task Not_Expose_Scratchpad_When_Returning_Current_User()
  {
    JsonElement user = await GetJson(_ownerClient, "/api/user");

    user.TryGetProperty("scratchpad", out _).Should().BeFalse();
    user.GetRawText().Should().NotContain(ScratchpadContent);
  }

  [Test]
  public async Task Return_Scratchpad_From_Its_Own_Endpoint()
  {
    JsonElement scratchpad = await GetJson(_ownerClient, "/api/user/scratchpad");

    scratchpad.GetProperty("content").GetString().Should().Be(ScratchpadContent);
    scratchpad.GetProperty("editedOn").GetDateTime().Should().NotBe(default);
  }

  [Test]
  public async Task Return_NoScratchpad_When_NeverSaved()
  {
    HttpResponseMessage response = await _readerClient.GetAsync("/api/user/scratchpad");

    response.StatusCode.Should().Be(HttpStatusCode.NoContent);
  }

  [Test]
  public async Task Return_Conflict_When_Saving_Scratchpad_SavedElsewhere()
  {
    HttpResponseMessage response = await _ownerClient.PutAsJsonAsync(
      "/api/user/scratchpad",
      new { content = "based on nothing", lastKnownEditedOn = (DateTime?)null }
    );

    response.StatusCode.Should().Be(HttpStatusCode.Conflict);
    (await GetJson(_ownerClient, "/api/user/scratchpad")).GetProperty("content").GetString()
      .Should().Be(ScratchpadContent);
  }

  private static IEnumerable<string> GetPermissionUserProperties(JsonElement journal, string userId)
  {
    return journal.GetProperty("permissions")
      .GetProperty(userId)
      .GetProperty("user")
      .EnumerateObject()
      .Select(p => p.Name);
  }

  private static async Task<JsonElement> GetJson(HttpClient client, string url)
  {
    HttpResponseMessage response = await client.GetAsync(url);
    response.StatusCode.Should().Be(HttpStatusCode.OK);
    return await response.Content.ReadFromJsonAsync<JsonElement>();
  }

  private async Task SeedJournalSharedWithReader()
  {
    // seed through the app's own repository so the data lands in the database the app reads
    var repo = _factory.Services.GetRequiredService<IUnrestrictedRepository>();

    var owner = new User { Name = OwnerName, LastLoginDate = DateTime.UtcNow };
    owner.Id = (await repo.UpsertUser(owner)).EntityId;
    _ownerId = owner.Id;

    await repo.UpdateScratchpad(
      _ownerId,
      new UserScratchpad { Content = ScratchpadContent, EditedOn = DateTime.UtcNow },
      null
    );

    UpsertResult readerResult = await repo.UpsertUser(new User { Name = ReaderName });

    UpsertResult journalResult = await repo.UpsertJournal(
      new ScrapsJournal
      {
        Name = "Shared Journal",
        UserId = _ownerId,
        EditedOn = DateTime.UtcNow,
        Permissions = new UserPermissions
        {
          { readerResult.EntityId, new PermissionDefinition { Kind = PermissionKind.Read } }
        }
      }
    );
    _journalId = journalResult.EntityId;

    using IServiceScope scope = _factory.Services.CreateScope();
    _ownerRefreshToken = await scope.ServiceProvider.GetRequiredService<RefreshTokenService>().Issue(owner);
  }

  private HttpClient CreateClient(string userName)
  {
    HttpClient client = _factory.CreateClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", CreateToken(userName));
    return client;
  }

  private static string CreateToken(string userName)
  {
    var tokenHandler = new JwtSecurityTokenHandler();
    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, userName)]),
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
