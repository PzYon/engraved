using System.Diagnostics;
using Metrix.Core.Application.Commands;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Queries;
using Microsoft.Extensions.Caching.Memory;

namespace Metrix.Core.Application;

public class Dispatcher
{
  private readonly IRepository _repository;
  private readonly IDateService _dateService;
  private readonly IMemoryCache _memoryCache;

  public Dispatcher(IUserScopedRepository repository, IDateService dateService, IMemoryCache memoryCache)
  {
    _repository = repository;
    _dateService = dateService;
    _memoryCache = memoryCache;
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

    string cacheKey = query.GetType().FullName!;

    if (!queryExecutor.DisableCache && _memoryCache.TryGetValue(cacheKey, out CacheItem<TResult> cachedResult))
    {
      return cachedResult.Value;
    }

    TResult result = await queryExecutor.Execute(_repository);

    var cacheItem = new CacheItem<TResult>
    {
      Value = result
    };

    _memoryCache.Set(cacheKey, cacheItem);

    return result;
  }
}

public class CacheItem<TResult>
{
  public TResult Value { get; set; }

  public string Token { get; set; }
}
