using System.Diagnostics;
using Metrix.Core.Application.Commands;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Queries;

namespace Metrix.Core.Application;

public class Dispatcher
{
  private readonly IDateService _dateService;
  private readonly IRepository _repository;

  public Dispatcher(IUserScopedRepository repository, IDateService dateService)
  {
    _repository = repository;
    _dateService = dateService;
  }

  public async Task<TResult> Query<TResult>(IQuery<TResult> query)
  {
    return await Execute(
      async () => await query.CreateExecutor().Execute(_repository),
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
}
