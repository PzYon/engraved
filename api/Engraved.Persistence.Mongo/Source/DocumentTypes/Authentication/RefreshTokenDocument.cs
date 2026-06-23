namespace Engraved.Persistence.Mongo.DocumentTypes.Authentication;

// Embedded as a sub-document on UserDocument (no own collection - see RefreshToken).
public class RefreshTokenDocument
{
  public string TokenHash { get; set; } = null!;

  public DateTime ExpiresAt { get; set; }

  public DateTime CreatedOn { get; set; }
}
