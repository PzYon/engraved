namespace Engraved.Core.Domain.Authentication;

// Stored as a sub-document on the user (we are limited to 3 Mongo collections
// on Azure Cosmos, so refresh tokens cannot live in their own collection).
public class RefreshToken
{
  // Only the hash of the token is stored, never the token itself, so a leaked
  // database does not expose usable refresh tokens.
  public string TokenHash { get; set; } = null!;

  public DateTime ExpiresAt { get; set; }

  public DateTime CreatedOn { get; set; }
}
