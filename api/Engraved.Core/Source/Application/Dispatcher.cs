using System.Diagnostics;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries;

namespace Engraved.Core.Application;

public class Dispatcher
{
  private readonly IUserScopedRepository _repository;
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

  private async Task<TResult> ExecuteQuery<TResult>(IQuery<TResult> query)
  {
    IQueryExecutor<TResult> queryExecutor = query.CreateExecutor();

    if (!queryExecutor.DisableCache && _queryCache.TryGetValue(queryExecutor, query, out TResult? cachedResult))
    {
      return cachedResult!;
    }

    TResult result = await queryExecutor.Execute(_repository);
    _queryCache.Set(queryExecutor, query, result);

    return result;
  }

  public async Task<CommandResult> Command(ICommand command)
  {
    return await Execute(
      () => ExecuteCommand(command),
      $"Command {command.GetType().Name}"
    );
  }

  private async Task<CommandResult> ExecuteCommand(ICommand command)
  {
    CommandResult commandResult = await command.CreateExecutor().Execute(_repository, _dateService);

    InvalidateCache(commandResult);

    return commandResult;
  }

  private void InvalidateCache(CommandResult commandResult)
  {
    string[] affectedUserIds = commandResult.AffectedUserIds
      .Union(new[] { _repository.CurrentUser.Value.Id! })
      .ToArray();

    _queryCache.Invalidate(affectedUserIds);
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
}
