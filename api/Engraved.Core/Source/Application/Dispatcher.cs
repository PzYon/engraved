using System.Diagnostics;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Engraved.Core.Application;

public class Dispatcher
{
  private readonly ILogger? _logger;
  private readonly IServiceProvider _serviceProvider;
  private readonly IUserScopedRepository _repository;
  private readonly QueryCache _queryCache;

  public Dispatcher(
    ILogger<Dispatcher>? logger,
    IServiceProvider serviceProvider,
    IUserScopedRepository repository,
    QueryCache queryCache
  )
  {
    _logger = logger;
    _serviceProvider = serviceProvider;
    _repository = repository;
    _queryCache = queryCache;
  }

  public async Task<TResult> Query<TResult, TQuery>(TQuery query) where TQuery : IQuery
  {
    return await Execute(
      () => ExecuteQuery<TResult, TQuery>(query),
      $"Query {query.GetType().Name}",
      query
    );
  }

  private async Task<TResult> ExecuteQuery<TResult, TQuery>(TQuery query) where TQuery : IQuery
  {
    var queryExecutor = _serviceProvider.GetService<IQueryExecutor<TResult, TQuery>>();
    if (queryExecutor == null)
    {
      throw new Exception($"No query executor registered for query of type {query.GetType()}");
    }

    if (!queryExecutor.DisableCache && _queryCache.TryGetValue(queryExecutor, query, out TResult? cachedResult))
    {
      return cachedResult!;
    }

    TResult result = await queryExecutor.Execute(query);
    _queryCache.Set(queryExecutor, query, result);

    return result;
  }

  public async Task<CommandResult> Command<TCommand>(TCommand command) where TCommand : ICommand
  {
    return await Execute(
      () => ExecuteCommand(command),
      $"Command {command.GetType().Name}",
      command
    );
  }

  private async Task<CommandResult> ExecuteCommand<TCommand>(TCommand command) where TCommand : ICommand
  {
    var commandExecutor = _serviceProvider.GetService<ICommandExecutor<TCommand>>();
    if (commandExecutor == null)
    {
      throw new Exception($"No command executor registered for command of type {command.GetType()}");
    }

    CommandResult commandResult = await commandExecutor.Execute(command);

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

  private async Task<TExecutionResult> Execute<TExecutionResult>(
    Func<Task<TExecutionResult>> action,
    string labelPrefix,
    object payload
  )
  {
    using (_logger!.BeginScope(new Dictionary<string, object> { ["Payload"] = JsonConvert.SerializeObject(payload) }))
    {
      _logger?.LogInformation($"{labelPrefix}: Start");

      var watch = Stopwatch.StartNew();

      TExecutionResult result = await action();

      _logger?.LogInformation($"{labelPrefix}: Executed in {watch.ElapsedMilliseconds}ms");

      return result;
    }
  }
}
