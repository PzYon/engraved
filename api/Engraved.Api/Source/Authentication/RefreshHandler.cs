using Engraved.Core.Domain.Users;

namespace Engraved.Api.Authentication;

public class RefreshHandler(RefreshTokenService refreshTokenService, JwtTokenFactory jwtTokenFactory)
{
  /// <summary>
  /// Exchanges a valid refresh token for a new access token (and a rotated
  /// refresh token). Returns null if the refresh token is missing, unknown or
  /// expired, so the caller can respond with 401.
  /// </summary>
  public async Task<AuthResult?> Refresh(string? refreshToken)
  {
    if (string.IsNullOrEmpty(refreshToken))
    {
      return null;
    }

    RotatedRefreshToken? rotated = await refreshTokenService.ValidateAndRotate(refreshToken);
    if (rotated == null)
    {
      return null;
    }

    IUser user = rotated.User;
    DateTime expiresAt = jwtTokenFactory.GetAccessTokenExpiry();

    return new AuthResult
    {
      JwtToken = jwtTokenFactory.CreateAccessToken(user.Name, expiresAt),
      ExpiresAt = expiresAt,
      RefreshToken = rotated.Token,
      User = user
    };
  }
}
