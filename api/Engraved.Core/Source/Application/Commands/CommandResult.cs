namespace Engraved.Core.Application.Commands;

public class CommandResult
{
  public string EntityId { get; } = null!;

  public string[] AffectedUserIds { get; } = [];

  // true when the command was accepted but deliberately not applied, because it targeted an
  // entity that no longer exists (e.g. an offline edit replayed after the entry was deleted).
  public bool Discarded { get; }

  public CommandResult(string entityId, string[] affectedUserIds)
  {
    EntityId = entityId;
    AffectedUserIds = affectedUserIds;
  }

  public CommandResult() { }

  private CommandResult(string entityId)
  {
    EntityId = entityId;
    Discarded = true;
  }

  public static CommandResult CreateDiscarded(string entityId)
  {
    return new CommandResult(entityId);
  }
}
