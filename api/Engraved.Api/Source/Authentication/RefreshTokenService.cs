using System.Security.Cryptography;
using System.Text;
using Engraved.Api.Settings;
using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Authentication;
using Microsoft.Extensions.Options;

namespace Engraved.Api.Authentication;

public class RefreshTokenService(
  IBaseRepository repository,
  AuthenticationConfig configuration,
  IDateService dateService
)
{
  public RefreshTokenService(
    IBaseRepository repository,
    IOptions<AuthenticationConfig> configuration,
    IDateService dateService
  ) : this(repository, configuration.Value, dateService) { }

  public async Task<string> Issue(string userId)
  {
    var token = RandomNumberGenerator.GetHexString(64);

    await repository.AddRefreshToken(
      new RefreshToken
      {
        UserId = userId,
        TokenHash = Hash(token),
        CreatedOn = dateService.UtcNow,
        ExpiresAt = dateService.UtcNow.AddMinutes(configuration.RefreshTokenLifetimeMinutes)
      }
    );

    return token;
  }

  /// <summary>
  /// Validates the given refresh token and, if valid, rotates it: the old token
  /// is deleted and a fresh one is issued. Returns the owning user id and the
  /// new token, or null if the token is unknown or expired.
  /// </summary>
  public async Task<RotatedRefreshToken?> ValidateAndRotate(string refreshToken)
  {
    RefreshToken? existing = await repository.GetRefreshToken(Hash(refreshToken));
    if (existing == null || existing.ExpiresAt <= dateService.UtcNow)
    {
      return null;
    }

    await repository.DeleteRefreshToken(existing.TokenHash);

    var newToken = await Issue(existing.UserId);

    return new RotatedRefreshToken(existing.UserId, newToken);
  }

  private static string Hash(string token)
  {
    return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
  }
}

public record RotatedRefreshToken(string UserId, string Token);
