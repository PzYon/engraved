namespace Engraved.Persistence.Mongo.DocumentTypes.Authentication;

public class RefreshTokenDocument
{
  public string TokenHash { get; set; } = null!;

  public DateTime ExpiresAt { get; set; }

  public DateTime CreatedOn { get; set; }
}
