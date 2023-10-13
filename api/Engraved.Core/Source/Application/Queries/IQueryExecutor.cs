namespace Engraved.Core.Application.Queries;

public interface IQueryExecutor<TResult, TQuery> where TQuery : IQuery
{
  bool DisableCache { get; }

  Task<TResult> Execute(TQuery query);
}
