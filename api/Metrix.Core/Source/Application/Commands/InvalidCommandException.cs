namespace Metrix.Core.Application.Commands;

public class InvalidCommandException : Exception
{
  public InvalidCommandException(ICommand command, string message)
    : base(command.GetType().Name + ": " + message) { }
}

