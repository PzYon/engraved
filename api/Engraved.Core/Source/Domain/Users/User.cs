namespace Engraved.Core.Domain.Users;

public class User : IUser
{
  public string? Id { get; set; }

  public Guid? GlobalUniqueId { get; set; }

  public string Name { get; set; } = null!;

  public string? DisplayName { get; set; }

  public string? ImageUrl { get; set; }

  public DateTime? LastLoginDate { get; set; }

  public List<string> FavoriteJournalIds { get; set; } = new();
}
