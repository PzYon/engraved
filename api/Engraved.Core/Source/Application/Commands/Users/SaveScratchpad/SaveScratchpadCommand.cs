namespace Engraved.Core.Application.Commands.Users.SaveScratchpad;

public class SaveScratchpadCommand : ICommand
{
  public string Content { get; set; } = string.Empty;

  // When the version the client has edited was saved, null if it has never seen a saved one.
  public DateTime? LastKnownEditedOn { get; set; }
}
