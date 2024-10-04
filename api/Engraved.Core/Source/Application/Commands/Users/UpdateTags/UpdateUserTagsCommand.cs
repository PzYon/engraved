namespace Engraved.Core.Application.Commands.Users.UpdateTags;

public class UpdateUserTagsCommand : ICommand
{
  public Dictionary<string, string> TagNames { get; set; }
}
