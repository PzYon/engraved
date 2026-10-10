namespace Engraved.Core.Application.Commands.Users.SaveScratchpad;

public class SaveScratchpadCommandResult(string entityId, DateTime editedOn) : CommandResult(entityId, [])
{
  public DateTime EditedOn { get; } = editedOn;
}
