using System;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Api.Authentication;
using Engraved.Api.Authentication.Google;
using Engraved.Api.Settings;
using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.User;
using FluentAssertions;
using Microsoft.Extensions.Caching.Memory;
using NUnit.Framework;

namespace Engraved.Api.Tests.Authentication;

public class LoginHandlerShould
{
  private readonly AuthenticationConfig _authenticationConfig = new()
  {
    JwtSecret = "cfadd57e-990a-4e95-9141-aa2493417126",
    TokenAudience = "http://au.dien.ce",
    TokenIssuer = "http://is.su.er",
    GoogleClientId = "791638561996-u8a0gf3af7b33qtk178djpek4054ir4d.apps.googleusercontent.com"
  };

  private IDateService _dateService = null!;
  private LoginHandler _loginHandler = null!;
  private IBaseRepository _testRepository = null!;
  private UserLoader _userLoader = null!;

  [SetUp]
  public void SetUp()
  {
    _testRepository = new InMemoryRepository();

    _userLoader = new UserLoader(_testRepository, new MemoryCache(new MemoryCacheOptions()));

    _dateService = new FakeDateService();

    _loginHandler = new LoginHandler(
      new GoogleTokenValidator(_authenticationConfig),
      _testRepository,
      _authenticationConfig,
      _dateService,
      _userLoader
    );
  }

  [Test]
  public void Throw_When_TokenHasInvalidFormat()
  {
    Assert.ThrowsAsync<GoogleTokenValidationException>(
      async () => await _loginHandler.Login("adsf asdf R@nD0m T3xT asdf asdf")
    );
  }

  [Test]
  public void Throw_When_TokenIsNotValid()
  {
    Assert.ThrowsAsync<GoogleTokenValidationException>(
      async () =>
        await _loginHandler.Login(
          "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJteS1wcm9qZWN0IiwiZXhwIjoxNTA5NjUwODAxLCJpYXQiOjE1MDk2NTQ0MDF9.F4iKO0R0wvHkpCcQoyrYttdGxE5FLAgDhbTJQLEHIBPsbL2WkLxXB9IGbDESn9rE7oxn89PJFRtcLn7kJwvdQkQcsPxn2RQorvDAnvAi1w3k8gpxYWo2DYJlnsi7mxXDqSUCNm1UCLRCW68ssYJxYLSg7B1xGMgDADGyYPaIx1EdN4dDbh-WeDyLLa7a8iWVBXdbmy1H3fEuiAyxiZpk2ll7DcQ6ryyMrU2XadwEr9PDqbLe5SrlaJsQbFi8RIdlQJSo_DZGOoAlA5bYTDYXb-skm7qvoaH5uMtOUb0rjijYuuxhNZvZDaBerEaxgmmlO0nQgtn12KVKjmKlisG79Q"
        )
    );
  }

  [Test]
  public async Task Follow_HappyPath_WithNewUser()
  {
    var displayName = "Hans Peter";
    var imageUrl = "https://im.age.url";
    var userName = "ha-pe";

    var loginHandler = new LoginHandler(
      new FakeGoogleTokenValidator(imageUrl, userName, displayName),
      _testRepository,
      _authenticationConfig,
      _dateService,
      _userLoader
    );

    AuthResult result = await loginHandler.Login("D03sNotM@tt3r");

    result.JwtToken.Should().NotBeEmpty();

    result.User.Should().NotBeNull();
    result.User!.DisplayName.Should().Be(displayName);
    result.User.Name.Should().Be(userName);
    result.User.ImageUrl.Should().Be(imageUrl);
    result.User.Id.Should().NotBeNull();
    result.User.LastLoginDate.Should().Be(_dateService.UtcNow);

    IUser[] users = await _testRepository.GetAllUsers();

    users.Length.Should().Be(1);

    IUser user = users[0];

    user.DisplayName.Should().Be(displayName);
    user.Name.Should().Be(userName);
    user.ImageUrl.Should().Be(imageUrl);
    user.Id.Should().NotBeNull();
    user.LastLoginDate.Should().Be(_dateService.UtcNow);
    user.FavoriteJournalIds.Count().Should().Be(1);

    string quickNotesId = user.FavoriteJournalIds.First();
    IJournal? journal = await _testRepository.GetJournal(quickNotesId);
    journal.Should().NotBeNull();
    journal!.Id.Should().Be(quickNotesId);
  }

  [Test]
  public async Task Follow_HappyPath_WithExistingUser()
  {
    var userId = "haPeID";
    var displayName = "Hans Peter";
    var imageUrl = "https://im.age.url";
    var userName = "ha-pe";

    await _testRepository.UpsertUser(
      new User
      {
        Id = userId,
        Name = userName,
        DisplayName = displayName,
        ImageUrl = imageUrl,
        LastLoginDate = DateTime.UtcNow.AddMinutes(-12345)
      }
    );

    var loginHandler = new LoginHandler(
      new FakeGoogleTokenValidator(imageUrl, userName, displayName),
      _testRepository,
      _authenticationConfig,
      _dateService,
      _userLoader
    );

    AuthResult result = await loginHandler.Login("D03sNotM@tt3r");

    result.User.Should().NotBeNull();
    result.User!.DisplayName.Should().Be(displayName);
    result.User!.Name.Should().Be(userName);
    result.User!.ImageUrl.Should().Be(imageUrl);
    result.User.Id.Should().NotBeNull();
    result.User.LastLoginDate.Should().Be(_dateService.UtcNow);

    IUser[] users = await _testRepository.GetAllUsers();

    users.Length.Should().Be(1);

    IUser user = users[0];

    user.DisplayName.Should().Be(displayName);
    user.Name.Should().Be(userName);
    user.ImageUrl.Should().Be(imageUrl);
    user.Id.Should().NotBeNull();
    user.LastLoginDate.Should().Be(_dateService.UtcNow);
  }
}
