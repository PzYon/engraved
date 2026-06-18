namespace Engraved.Api.Settings;

public class AuthenticationConfig
{
  public string? GoogleClientId { get; set; }
  public string? JwtSecret { get; set; }
  public string? TokenIssuer { get; set; }
  public string? TokenAudience { get; set; }

  /// <summary>
  /// Lifetime of the issued access token in minutes. The frontend refreshes the
  /// token silently before it expires, so this can be kept short.
  /// </summary>
  public int? AccessTokenLifetimeMinutes { get; set; }
}
