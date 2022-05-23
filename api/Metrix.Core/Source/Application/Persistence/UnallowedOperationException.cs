namespace Metrix.Core.Application.Persistence;

public class UnallowedOperationException : Exception
{
  public UnallowedOperationException(string message) : base(message) { }
}
