using System;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Api.Authentication;
using Engraved.Api.Authentication.Google;
using Engraved.Api.Settings;
using Engraved.Core.Application;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Users;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Api.Tests.Authentication;

public class LoginHandlerShould
{
  private readonly AuthenticationConfig _authenticationConfig = new()
  {
    JwtSecret = "cfadd57e-990a-4e95-9141-aa2493417126",
    TokenAudience = "http://au.dien.ce",
    TokenIssuer = "http://is.su.er",
    GoogleClientId = "791638561996-u8a0gf3af7b33qtk178djpek4054ir4d.apps.googleusercontent.com",
    AccessTokenLifetimeMinutes = 60,
    RefreshTokenLifetimeMinutes = 1440
  };

  private IDateService _dateService = null!;
  private LoginHandler _loginHandler = null!;
  private TestMongoRepository _testRepository = null!;
  private UserLoader _userLoader = null!;

  [SetUp]
  public async Task SetUp()
  {
    _testRepository = await Util.CreateMongoRepository();

    _userLoader = new UserLoader(_testRepository);

    _dateService = new FakeDateService();

    _loginHandler = CreateLoginHandler(new GoogleTokenValidator(_authenticationConfig));
  }

  [TearDown]
  public void TearDown()
  {
    _userLoader.Dispose();
  }

  private LoginHandler CreateLoginHandler(IGoogleTokenValidator tokenValidator)
  {
    return new LoginHandler(
      tokenValidator,
      _testRepository,
      _dateService,
      _userLoader,
      new JwtTokenFactory(_authenticationConfig, _dateService),
      new RefreshTokenService(_testRepository, _authenticationConfig, _dateService)
    );
  }

  [Test]
  public void Throw_When_TokenHasInvalidFormat()
  {
    Assert.ThrowsAsync<GoogleTokenValidationException>(async ()
      => await _loginHandler.Login("adsf asdf R@nD0m T3xT asdf asdf")
    );
  }

  [Test]
  public void Throw_When_TokenIsNotValid()
  {
    Assert.ThrowsAsync<GoogleTokenValidationException>(async () =>
      await _loginHandler.Login(
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJteS1wcm9qZWN0IiwiZXhwIjoxNTA5NjUwODAxLCJpYXQiOjE1MDk2NTQ0MDF9.F4iKO0R0wvHkpCcQoyrYttdGxE5FLAgDhbTJQLEHIBPsbL2WkLxXB9IGbDESn9rE7oxn89PJFRtcLn7kJwvdQkQcsPxn2RQorvDAnvAi1w3k8gpxYWo2DYJlnsi7mxXDqSUCNm1UCLRCW68ssYJxYLSg7B1xGMgDADGyYPaIx1EdN4dDbh-WeDyLLa7a8iWVBXdbmy1H3fEuiAyxiZpk2ll7DcQ6ryyMrU2XadwEr9PDqbLe5SrlaJsQbFi8RIdlQJSo_DZGOoAlA5bYTDYXb-skm7qvoaH5uMtOUb0rjijYuuxhNZvZDaBerEaxgmmlO0nQgtn12KVKjmKlisG79Q"
      )
    );
  }

  [Test]
  public async Task Follow_HappyPath_WithNewUser()
  {
    const string displayName = "Hans Peter";
    const string imageUrl = "https://im.age.url";
    const string userName = "ha-pe";

    LoginHandler loginHandler = CreateLoginHandler(new FakeGoogleTokenValidator(imageUrl, userName, displayName));

    AuthResult result = await loginHandler.Login("D03sNotM@tt3r");

    result.JwtToken.Should().NotBeEmpty();
    result.ExpiresAt.Should().Be(_dateService.UtcNow.AddMinutes(60));
    result.RefreshToken.Should().NotBeNullOrEmpty();

    result.User.Should().NotBeNull();
    result.User!.DisplayName.Should().Be(displayName);
    result.User.Name.Should().Be(userName);
    result.User.ImageUrl.Should().Be(imageUrl);
    result.User.Id.Should().NotBeNull();
    result.User.LastLoginDate.Should().BeCloseTo(_dateService.UtcNow, TimeSpan.FromMilliseconds(100));
    result.User.IsAdmin.Should().BeFalse("a brand new user is never an admin by default");

    var users = await _testRepository.GetAllUsers();

    users.Length.Should().Be(1);

    IUser user = users[0];

    user.DisplayName.Should().Be(displayName);
    user.Name.Should().Be(userName);
    user.ImageUrl.Should().Be(imageUrl);
    user.Id.Should().NotBeNull();
    user.LastLoginDate.Should().BeCloseTo(_dateService.UtcNow, TimeSpan.FromMilliseconds(100));
    user.FavoriteJournalIds.Count().Should().Be(1);
    user.GlobalUniqueId.Should().NotBeNull();

    var quickNotesId = user.FavoriteJournalIds.First();
    IJournal? journal = await _testRepository.GetJournal(quickNotesId);
    journal.Should().NotBeNull();
    journal.Id.Should().Be(quickNotesId);
  }

  [Test]
  public async Task Follow_HappyPath_WithExistingUser()
  {
    const string userId = TestIds.ThirdUserId;
    const string displayName = "Hans Peter";
    const string imageUrl = "https://im.age.url";
    const string userName = "ha-pe";
    var globalUniqueId = Guid.NewGuid();

    var existingUser = new User
    {
      Id = userId,
      Name = userName,
      DisplayName = displayName,
      ImageUrl = imageUrl,
      LastLoginDate = DateTime.UtcNow.AddMinutes(-12345),
      GlobalUniqueId = globalUniqueId,
      IsAdmin = true
    };

    // must ensure the journal exists as it will be loaded as favorite
    var journalId = "60703c3b000000000000000a";
    existingUser.FavoriteJournalIds.Add(journalId);
    await _testRepository.UpsertJournal(new ScrapsJournal { Id = journalId, Name = "Quick Scraps", UserId = userId });

    await _testRepository.UpsertUser(existingUser);

    LoginHandler loginHandler = CreateLoginHandler(new FakeGoogleTokenValidator(imageUrl, userName, displayName));

    AuthResult result = await loginHandler.Login("D03sNotM@tt3r");

    result.User.Should().NotBeNull();
    result.User!.DisplayName.Should().Be(displayName);
    result.User!.Name.Should().Be(userName);
    result.User!.ImageUrl.Should().Be(imageUrl);
    result.User.Id.Should().Be(userId);
    result.User.GlobalUniqueId.Should().Be(globalUniqueId);
    result.User.LastLoginDate.Should().BeCloseTo(_dateService.UtcNow, TimeSpan.FromMilliseconds(100));
    result.User.IsAdmin.Should().BeTrue("the existing user's admin flag must be preserved across login");

    var users = await _testRepository.GetAllUsers();

    users.Length.Should().Be(1);

    IUser user = users[0];

    user.DisplayName.Should().Be(displayName);
    user.Name.Should().Be(userName);
    user.ImageUrl.Should().Be(imageUrl);
    user.Id.Should().Be(userId);
    user.LastLoginDate.Should().BeCloseTo(_dateService.UtcNow, TimeSpan.FromMilliseconds(100));
  }
}
