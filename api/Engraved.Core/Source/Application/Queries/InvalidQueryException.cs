namespace Engraved.Core.Application.Queries;

public class InvalidQueryException(IQuery query, string message) : Exception(query.GetType().Name + ": " + message);
