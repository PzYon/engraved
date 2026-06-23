namespace Engraved.Core.Domain.Authentication;

public class RefreshToken
{
  public string? Id { get; set; }

  public string UserId { get; set; } = null!;

  // Only the hash of the token is stored, never the token itself, so a leaked
  // database does not expose usable refresh tokens.
  public string TokenHash { get; set; } = null!;

  public DateTime ExpiresAt { get; set; }

  public DateTime CreatedOn { get; set; }
}
