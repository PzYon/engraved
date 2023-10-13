namespace Engraved.Core.Application.Queries;

public class InvalidQueryException : Exception
{
  public InvalidQueryException(IQuery query, string message)
    : base(query.GetType().Name + ": " + message) { }
}
