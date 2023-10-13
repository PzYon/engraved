using System.Diagnostics;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries;
using Microsoft.Extensions.DependencyInjection;

namespace Engraved.Core.Application;

public class Dispatcher
{
  private readonly IServiceProvider _serviceProvider;
  private readonly IUserScopedRepository _repository;
  private readonly QueryCache _queryCache;

  public Dispatcher(
    IServiceProvider serviceProvider,
    IUserScopedRepository repository,
    QueryCache queryCache
  )
  {
    _serviceProvider = serviceProvider;
    _repository = repository;
    _queryCache = queryCache;
  }

  public async Task<TResult> Query<TResult, TQuery>(TQuery query) where TQuery : IQuery
  {
    return await Execute(
      () => ExecuteQuery<TResult, TQuery>(query),
      $"Query {query.GetType().Name}"
    );
  }

  private async Task<TResult> ExecuteQuery<TResult, TQuery>(TQuery query) where TQuery : IQuery
  {
    IQueryExecutor<TResult, TQuery> queryExecutor = _serviceProvider.GetService<IQueryExecutor<TResult, TQuery>>();

    if (!queryExecutor.DisableCache && _queryCache.TryGetValue(queryExecutor, query, out TResult? cachedResult))
    {
      return cachedResult!;
    }

    TResult result = await queryExecutor.Execute(query);
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
    CommandResult commandResult = await command.CreateExecutor().Execute(_repository, (DateService) null );

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
