using Engraved.Core.Application.Persistence;

namespace Engraved.Core.Application.Queries;

public interface IQueryExecutor<TResult>
{
  bool DisableCache { get; }

  Task<TResult> Execute(IRepository repository);
}
