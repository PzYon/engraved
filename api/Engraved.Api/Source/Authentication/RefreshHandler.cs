using Engraved.Core.Domain.Users;

namespace Engraved.Api.Authentication;

public class RefreshHandler(
  RefreshTokenService refreshTokenService,
  JwtTokenFactory jwtTokenFactory,
  AdminAuthorizationService adminAuthorizationService
)
{
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
    user.IsAdmin = adminAuthorizationService.IsAdmin(user.Name);
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
