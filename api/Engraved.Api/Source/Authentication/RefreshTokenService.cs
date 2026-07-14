using System.Security.Cryptography;
using System.Text;
using Engraved.Api.Settings;
using Engraved.Core.Application;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Authentication;
using Engraved.Core.Domain.Users;
using Microsoft.Extensions.Options;

namespace Engraved.Api.Authentication;

public class RefreshTokenService(
  IUnrestrictedRepository unrestrictedRepository,
  AuthenticationConfig configuration,
  IDateService dateService
)
{
  public RefreshTokenService(
    IUnrestrictedRepository unrestrictedRepository,
    IOptions<AuthenticationConfig> configuration,
    IDateService dateService
  ) : this(unrestrictedRepository, configuration.Value, dateService) { }

  public async Task<string> Issue(IUser user)
  {
    var secret = AddToken(user);
    await unrestrictedRepository.UpsertUser(user);
    return Compose(user.Id!, secret);
  }

  public async Task<RotatedRefreshToken?> ValidateAndRotate(string refreshToken)
  {
    if (!TryParse(refreshToken, out var userId, out var secret))
    {
      return null;
    }

    IUser? user = await unrestrictedRepository.GetUser(userId);
    if (user == null)
    {
      return null;
    }

    var hash = Hash(secret);
    RefreshToken? match = user.RefreshTokens.FirstOrDefault(t => t.TokenHash == hash);
    if (match == null || match.ExpiresAt <= dateService.UtcNow)
    {
      return null;
    }

    user.RefreshTokens.Remove(match);
    var newSecret = AddToken(user);
    await unrestrictedRepository.UpsertUser(user);

    return new RotatedRefreshToken(user, Compose(user.Id!, newSecret));
  }

  public async Task<bool> RevokeOtherTokens(string? refreshToken)
  {
    if (string.IsNullOrEmpty(refreshToken) || !TryParse(refreshToken, out var userId, out var secret))
    {
      return false;
    }

    IUser? user = await unrestrictedRepository.GetUser(userId);
    if (user == null)
    {
      return false;
    }

    var hash = Hash(secret);
    RefreshToken? current = user.RefreshTokens.FirstOrDefault(t => t.TokenHash == hash);
    if (current == null || current.ExpiresAt <= dateService.UtcNow)
    {
      return false;
    }

    user.RefreshTokens.RemoveAll(t => t.TokenHash != hash);
    await unrestrictedRepository.UpsertUser(user);
    return true;
  }

  private string AddToken(IUser user)
  {
    user.RefreshTokens.RemoveAll(t => t.ExpiresAt <= dateService.UtcNow);

    var secret = RandomNumberGenerator.GetHexString(64);

    user.RefreshTokens.Add(
      new RefreshToken
      {
        TokenHash = Hash(secret),
        CreatedOn = dateService.UtcNow,
        ExpiresAt = dateService.UtcNow.AddMinutes(configuration.RefreshTokenLifetimeMinutes)
      }
    );

    return secret;
  }

  private static string Compose(string userId, string secret)
  {
    return $"{userId}.{secret}";
  }

  private static bool TryParse(string token, out string userId, out string secret)
  {
    userId = string.Empty;
    secret = string.Empty;

    var separatorIndex = token.IndexOf('.');
    if (separatorIndex <= 0 || separatorIndex == token.Length - 1)
    {
      return false;
    }

    userId = token[..separatorIndex];
    secret = token[(separatorIndex + 1)..];
    return true;
  }

  private static string Hash(string token)
  {
    return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
  }
}

public record RotatedRefreshToken(IUser User, string Token);
