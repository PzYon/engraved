using System.Diagnostics;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Engraved.Core.Application;

public class Dispatcher(
  ILogger<Dispatcher> logger,
  IServiceProvider serviceProvider,
  IUserScopedRepository repository,
  QueryCache queryCache
)
{
  public async Task<TResult> Query<TResult, TQuery>(TQuery query) where TQuery : IQuery
  {
    return await Execute(
      () => ExecuteQuery<TResult, TQuery>(query),
      query
    );
  }

  private async Task<TResult> ExecuteQuery<TResult, TQuery>(TQuery query) where TQuery : IQuery
  {
    var queryExecutor = serviceProvider.GetService<IQueryExecutor<TResult, TQuery>>();
    if (queryExecutor == null)
    {
      throw new Exception($"No query executor registered for query of type {query.GetType()}");
    }

    TResult result = await queryCache.GetOrCreate(queryExecutor, query, () => queryExecutor.Execute(query));

    if (typeof(TResult).IsArray)
    {
      logger.LogInformation("{Name}: Found {Length} results", query.GetType().Name, (result as Array)?.Length ?? 0);
    }

    return result;
  }

  public async Task<CommandResult> Command<TCommand>(TCommand command) where TCommand : ICommand
  {
    return await Execute(
      () => ExecuteCommand(command),
      command
    );
  }

  private async Task<CommandResult> ExecuteCommand<TCommand>(TCommand command) where TCommand : ICommand
  {
    var commandExecutor = serviceProvider.GetService<ICommandExecutor<TCommand>>();
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
    var affectedUserIds = commandResult.AffectedUserIds
      .Union([repository.CurrentUser.Value.Id!])
      .ToArray();

    queryCache.Invalidate(affectedUserIds);
  }

  private async Task<TExecutionResult> Execute<TExecutionResult>(
    Func<Task<TExecutionResult>> action,
    object payload
  )
  {
    var name = payload.GetType().Name;

    using (logger.BeginScope(
             new Dictionary<string, object>
             {
               ["ActionKind"] = payload is IQuery ? "query" : "command",
               ["PayloadType"] = name,
               ["Payload"] = JsonConvert.SerializeObject(payload)
             }
           ))
    {
      logger.LogInformation("{Name}: Starting", name);

      var watch = Stopwatch.StartNew();
      TExecutionResult result = await action();
      watch.Stop();

      using (logger.BeginScope(new Dictionary<string, object> { ["Duration"] = watch.ElapsedMilliseconds }))
      {
        logger.LogInformation("{Name}: Completed in {WatchElapsedMilliseconds}ms", name, watch.ElapsedMilliseconds);
      }

      return result;
    }
  }
}
