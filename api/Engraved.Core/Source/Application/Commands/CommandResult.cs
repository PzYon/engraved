namespace Engraved.Core.Application.Commands;

public class CommandResult
{
  public string EntityId { get; } = null!;

  public string[] AffectedUserIds { get; } = Array.Empty<string>();

  public CommandResult(string entityId, string[] affectedUserIds)
  {
    EntityId = entityId;
    AffectedUserIds = affectedUserIds;
  }

  public CommandResult() { }
}
