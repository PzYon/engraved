namespace Engraved.Core.Domain.Users;

public class UserTag
{
  public string Id { get; set; }
  
  public string Label  { get; set; }
  
  public List<string> JournalIds { get; set; } = [];
}
