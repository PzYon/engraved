namespace Engraved.Core.Application.Commands;

public class InvalidCommandException(ICommand command, string message)
  : Exception(command.GetType().Name + ": " + message);
