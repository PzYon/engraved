using Metrix.Core.Application.Persistence;

namespace Metrix.Core.Application.Queries;

public interface IQueryExecutor<TResult>
{
  Task<TResult> Execute(IDb db);
}
