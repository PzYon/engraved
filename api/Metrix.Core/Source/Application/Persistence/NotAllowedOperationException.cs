namespace Metrix.Core.Application.Persistence;

public class NotAllowedOperationException : Exception
{
  public NotAllowedOperationException(string message) : base(message) { }
}
