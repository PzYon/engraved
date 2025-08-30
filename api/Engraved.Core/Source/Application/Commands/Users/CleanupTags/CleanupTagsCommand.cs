namespace Engraved.Core.Application.Commands.Users.CleanupTags;

public class CleanupTagsCommand : ICommand
{
  public bool DryRun { get; set; }
}