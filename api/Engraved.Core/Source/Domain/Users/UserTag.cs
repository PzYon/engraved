namespace Engraved.Core.Domain.Users;

public class UserTag
{
  public string Id { get; set; } = null!;

  public string Label { get; set; } = null!;

  public List<string> JournalIds { get; set; } = [];
}
