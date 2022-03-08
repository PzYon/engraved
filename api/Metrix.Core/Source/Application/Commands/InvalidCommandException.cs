namespace Metrix.Core.Application.Commands;

public class InvalidCommandException : Exception
{
  private readonly Type _commandType;

  public InvalidCommandException(Type commandType, string message) : base(message)
  {
    _commandType = commandType;
  }
}
