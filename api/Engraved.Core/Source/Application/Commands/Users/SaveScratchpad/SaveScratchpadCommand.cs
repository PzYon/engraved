namespace Engraved.Core.Application.Commands.Users.SaveScratchpad;

public class SaveScratchpadCommand : ICommand
{
  public string Content { get; set; } = string.Empty;
}
