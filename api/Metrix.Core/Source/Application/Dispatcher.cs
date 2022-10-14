using System.Diagnostics;
using Metrix.Core.Application.Commands;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Queries;

namespace Metrix.Core.Application;

public class Dispatcher
{
  private readonly IRepository _repository;
  private readonly IDateService _dateService;
  private readonly QueryCache _queryCache;

  public Dispatcher(IUserScopedRepository repository, IDateService dateService, QueryCache queryCache)
  {
    _repository = repository;
    _dateService = dateService;
    _queryCache = queryCache;
  }

  public async Task<TResult> Query<TResult>(IQuery<TResult> query)
  {
    return await Execute(
      () => ExecuteQuery(query),
      $"Query {query.GetType().Name}"
    );
  }

  public async Task<CommandResult> Command(ICommand command)
  {
    return await Execute(
      async () => await command.CreateExecutor().Execute(_repository, _dateService),
      $"Command {command.GetType().Name}"
    );
  }

  private static async Task<TExecutionResult> Execute<TExecutionResult>(
    Func<Task<TExecutionResult>> action,
    string labelPrefix
  )
  {
    var watch = Stopwatch.StartNew();

    TExecutionResult result = await action();

    Console.WriteLine($"{labelPrefix} executed in {watch.ElapsedMilliseconds}ms");

    return result;
  }

  private async Task<TResult> ExecuteQuery<TResult>(IQuery<TResult> query)
  {
    IQueryExecutor<TResult> queryExecutor = query.CreateExecutor();

    if (!queryExecutor.DisableCache && _queryCache.TryGetValue(queryExecutor, query, out TResult cachedResult))
    {
      return cachedResult;
    }

    TResult result = await queryExecutor.Execute(_repository);
    _queryCache.Set(queryExecutor, query, result);

    return result;
  }
}
