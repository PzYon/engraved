using System;
using System.Threading.Tasks;
using Metrix.Api.Authentication;
using Metrix.Api.Authentication.Google;
using Metrix.Api.Settings;
using Metrix.Core.Application;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Persistence.Demo;
using Metrix.Core.Domain.User;
using NUnit.Framework;

namespace Metrix.Api.Tests.Authentication;

public class LoginHandlerShould
{
  private IRepository _testRepository = null!;

  private LoginHandler _loginHandler = null!;

  private IDateService _dateService = null!;

  private readonly AuthenticationConfig _authenticationConfig = new()
  {
    JwtSecret = "asdfasjvv3q9r28fuvhfadsioüeruwg4thrbjvkdöaowi34uwhtrjbsgnvcm",
    TokenAudience = "http://au.dien.ce",
    TokenIssuer = "http://is.su.er",
    GoogleClientId = "147930987098-feu514ne5nol9fhdpd2p3sm3fnj2eicf.apps.googleusercontent.com"
  };

  [SetUp]
  public void SetUp()
  {
    _testRepository = new InMemoryRepository();

    _dateService = new FakeDateService();

    _loginHandler = new LoginHandler(
      new GoogleTokenValidator(_authenticationConfig),
      _testRepository,
      _authenticationConfig,
      _dateService
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
      _dateService
    );

    AuthResult result = await loginHandler.Login("D03sNotM@tt3r");

    Assert.IsNotEmpty(result.JwtToken);

    Assert.IsNotNull(result.User);
    Assert.AreEqual(displayName, result.User!.DisplayName);
    Assert.AreEqual(userName, result.User.Name);
    Assert.AreEqual(imageUrl, result.User.ImageUrl);
    Assert.IsNotNull(result.User.Id);
    Assert.AreEqual(_dateService.UtcNow, result.User.LastLoginDate);

    IUser[] users = await _testRepository.GetAllUsers();

    Assert.AreEqual(1, users.Length);

    IUser user = users[0];

    Assert.AreEqual(displayName, user.DisplayName);
    Assert.AreEqual(userName, user.Name);
    Assert.AreEqual(imageUrl, user.ImageUrl);
    Assert.IsNotNull(user.Id);
    Assert.AreEqual(_dateService.UtcNow, user.LastLoginDate);
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
      _dateService
    );

    AuthResult result = await loginHandler.Login("D03sNotM@tt3r");

    Assert.IsNotNull(result.User);
    Assert.AreEqual(displayName, result.User!.DisplayName);
    Assert.AreEqual(userName, result.User.Name);
    Assert.AreEqual(imageUrl, result.User.ImageUrl);
    Assert.IsNotNull(result.User.Id);
    Assert.AreEqual(_dateService.UtcNow, result.User.LastLoginDate);

    IUser[] users = await _testRepository.GetAllUsers();

    Assert.AreEqual(1, users.Length);

    IUser user = users[0];

    Assert.AreEqual(displayName, user.DisplayName);
    Assert.AreEqual(userName, user.Name);
    Assert.AreEqual(imageUrl, user.ImageUrl);
    Assert.IsNotNull(user.Id);
    Assert.AreEqual(_dateService.UtcNow, user.LastLoginDate);
  }
}
