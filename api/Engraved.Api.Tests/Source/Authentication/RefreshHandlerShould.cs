using System.Threading.Tasks;
using Engraved.Api.Authentication;
using Engraved.Api.Settings;
using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Demo;
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
  private IBaseRepository _repository = null!;
  private RefreshTokenService _refreshTokenService = null!;
  private RefreshHandler _refreshHandler = null!;
  private string _userId = null!;

  [SetUp]
  public async Task SetUp()
  {
    _repository = new InMemoryRepository();
    _dateService = new FakeDateService();
    _refreshTokenService = new RefreshTokenService(_repository, _config, _dateService);
    _refreshHandler = new RefreshHandler(
      _refreshTokenService,
      _repository,
      new JwtTokenFactory(_config, _dateService)
    );

    _userId = (await _repository.UpsertUser(new User { Name = "me@tests" })).EntityId;
  }

  [Test]
  public async Task IssueNewAccessAndRotatedRefreshToken_WhenTokenIsValid()
  {
    var refreshToken = await _refreshTokenService.Issue(_userId);

    AuthResult? result = await _refreshHandler.Refresh(refreshToken);

    result.Should().NotBeNull();
    result!.JwtToken.Should().NotBeNullOrEmpty();
    result.ExpiresAt.Should().Be(_dateService.UtcNow.AddMinutes(15));
    result.RefreshToken.Should().NotBeNullOrEmpty();
    result.RefreshToken.Should().NotBe(refreshToken, "the refresh token must be rotated");
    result.User!.Id.Should().Be(_userId);
  }

  [Test]
  public async Task RejectTheOldToken_AfterRotation()
  {
    var refreshToken = await _refreshTokenService.Issue(_userId);

    await _refreshHandler.Refresh(refreshToken);

    // the original token was rotated away and must no longer be accepted
    (await _refreshHandler.Refresh(refreshToken)).Should().BeNull();
  }

  [Test]
  public async Task AcceptTheRotatedToken()
  {
    var refreshToken = await _refreshTokenService.Issue(_userId);

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
    var refreshToken = await _refreshTokenService.Issue(_userId);

    _dateService.UtcNow = _dateService.UtcNow.AddMinutes(_config.RefreshTokenLifetimeMinutes + 1);

    (await _refreshHandler.Refresh(refreshToken)).Should().BeNull();
  }
}
