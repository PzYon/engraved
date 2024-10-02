namespace Engraved.Core.Application.Commands.Users.UpdateTags;

public class UpdateUserTagsCommand : ICommand
{
  public string[] TagNames { get; set; }
}
