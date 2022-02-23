using Metrix.Core.Application.Persistence;

namespace Metrix.Core.Application.Queries;

public interface IQueryExecutor<TQuery, TResult> where TQuery : IQuery<TQuery, TResult>
{
  TResult Execute(IDb db, TQuery query);
}
