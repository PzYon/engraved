using Metrix.Core.Application.Persistence;

namespace Metrix.Core.Application.Queries;

public interface IQueryExecutor<TResult>
{
  bool DisableCache { get; }

  Task<TResult> Execute(IRepository repository);
}
