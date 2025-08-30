namespace Engraved.Core.Application.Commands.Users.CleanupTags;

public class CleanupTagsCommandResult(string entityId, string[] affectedUserIds)
  : CommandResult(entityId, affectedUserIds)
{
  public bool DryRun { get; set; }

  public List<string> JournalIdsToRemove { get; set; } = [];
}
