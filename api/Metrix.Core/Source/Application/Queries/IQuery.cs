namespace Metrix.Core.Application.Queries;

public interface IQuery<TQuery, TResult> where TQuery : IQuery<TQuery, TResult>
{
  IQueryExecutor<TQuery, TResult> CreateExecutor();
}
