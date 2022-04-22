namespace Metrix.Core.Application.Queries;

public class InvalidQueryException<T> : Exception
{
  public InvalidQueryException(IQuery<T> query, string message)
    : base(query.GetType().Name + ": " + message) { }
}
