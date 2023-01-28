namespace Engraved.Core.Application.Queries;

public interface IQuery<TResult>
{
  IQueryExecutor<TResult> CreateExecutor();
}
