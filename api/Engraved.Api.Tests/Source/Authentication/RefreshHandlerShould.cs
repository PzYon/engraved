using System.Threading.Tasks;
using Engraved.Api.Authentication;
using Engraved.Api.Settings;
using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.TestUtils;
using Engraved.Core.Domain.Users;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Api.Tests.Authentication;

public class RefreshHandlerShould
{
  private readonly AuthenticationConfig _config = new()
  {
    JwtSecret = "cfadd57e-990a-4e95-9141-aa2493417126",
    TokenAudience = "http://au.dien.ce",
    TokenIssuer = "http://is.su.er",
    AccessTokenLifetimeMinutes = 15,
    RefreshTokenLifetimeMinutes = 1440
  };

  private FakeDateService _dateService = null!;
  private TestMongoRepository _repository = null!;
  private RefreshTokenService _refreshTokenService = null!;
  private RefreshHandler _refreshHandler = null!;
  private IUser _user = null!;

  [SetUp]
  public async Task SetUp()
  {
    _repository = await Util.CreateMongoRepository();
    _dateService = new FakeDateService();
    _refreshTokenService = new RefreshTokenService(_repository, _config, _dateService);
    _refreshHandler = new RefreshHandler(_refreshTokenService, new JwtTokenFactory(_config, _dateService));

    _user = new User { Id = TestIds.OtherUserId, Name = "me@tests" };
    await _repository.UpsertUser(_user);
  }

  [Test]
  public async Task IssueNewAccessAndRotatedRefreshToken_WhenTokenIsValid()
  {
    var refreshToken = await _refreshTokenService.Issue(_user);

    AuthResult? result = await _refreshHandler.Refresh(refreshToken);

    result.Should().NotBeNull();
    result!.JwtToken.Should().NotBeNullOrEmpty();
    result.ExpiresAt.Should().Be(_dateService.UtcNow.AddMinutes(15));
    result.RefreshToken.Should().NotBeNullOrEmpty();
    result.RefreshToken.Should().NotBe(refreshToken, "the refresh token must be rotated");
    result.User!.Id.Should().Be(_user.Id);
  }

  [Test]
  public async Task RejectTheOldToken_AfterRotation()
  {
    var refreshToken = await _refreshTokenService.Issue(_user);

    await _refreshHandler.Refresh(refreshToken);

    // the original token was rotated away and must no longer be accepted
    (await _refreshHandler.Refresh(refreshToken)).Should().BeNull();
  }

  [Test]
  public async Task AcceptTheRotatedToken()
  {
    var refreshToken = await _refreshTokenService.Issue(_user);

    AuthResult? first = await _refreshHandler.Refresh(refreshToken);

    (await _refreshHandler.Refresh(first!.RefreshToken)).Should().NotBeNull();
  }

  [Test]
  public async Task ReturnNull_ForUnknownToken()
  {
    (await _refreshHandler.Refresh("does-not-exist")).Should().BeNull();
  }

  [Test]
  public async Task ReturnNull_ForMissingToken()
  {
    (await _refreshHandler.Refresh(null)).Should().BeNull();
    (await _refreshHandler.Refresh("")).Should().BeNull();
  }

  [Test]
  public async Task ReturnNull_ForExpiredToken()
  {
    var refreshToken = await _refreshTokenService.Issue(_user);

    _dateService.UtcNow = _dateService.UtcNow.AddMinutes(_config.RefreshTokenLifetimeMinutes + 1);

    (await _refreshHandler.Refresh(refreshToken)).Should().BeNull();
  }

  [Test]
  public async Task RevokeOtherTokens_KeepsOnlyTheCurrentToken()
  {
    var other1 = await _refreshTokenService.Issue(_user);
    var current = await _refreshTokenService.Issue(_user);
    var other2 = await _refreshTokenService.Issue(_user);

    (await _refreshTokenService.RevokeOtherTokens(current)).Should().BeTrue();

    // the current device's token still works ...
    (await _refreshHandler.Refresh(current)).Should().NotBeNull();

    // ... the other devices' tokens no longer do.
    (await _refreshHandler.Refresh(other1)).Should().BeNull();
    (await _refreshHandler.Refresh(other2)).Should().BeNull();
  }

  [Test]
  public async Task RevokeOtherTokens_ReturnsFalse_ForInvalidToken()
  {
    (await _refreshTokenService.RevokeOtherTokens(null)).Should().BeFalse();
    (await _refreshTokenService.RevokeOtherTokens("does-not-exist")).Should().BeFalse();
  }
}
