namespace Engraved.Core.Application.Commands;

public class CommandResult
{
  public string EntityId { get; } = null!;

  public string[] AffectedUserIds { get; } = [];

  public CommandResult(string entityId, string[] affectedUserIds)
  {
    EntityId = entityId;
    AffectedUserIds = affectedUserIds;
  }

  public CommandResult() { }
}
