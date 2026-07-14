namespace Engraved.Core.Domain.Users;

public class RefreshToken
{
  public string TokenHash { get; set; } = null!;

  public DateTime ExpiresAt { get; set; }

  public DateTime CreatedOn { get; set; }
}
