namespace Engraved.Api.Settings;

public class AuthenticationConfig
{
  public string? GoogleClientId { get; set; }
  public string? JwtSecret { get; set; }
  public string? TokenIssuer { get; set; }
  public string? TokenAudience { get; set; }
}
