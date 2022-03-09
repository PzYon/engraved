using Metrix.Core.Application.Persistence;

namespace Metrix.Core.Application.Queries;

public interface IQueryExecutor<out TResult>
{
  TResult Execute(IDb db);
}
