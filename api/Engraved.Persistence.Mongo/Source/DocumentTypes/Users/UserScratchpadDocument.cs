namespace Engraved.Persistence.Mongo.DocumentTypes.Users;

public class UserScratchpadDocument
{
  public string Content { get; set; } = string.Empty;

  public DateTime EditedOn { get; set; }
}
