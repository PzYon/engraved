namespace Engraved.Api.Temp;

public interface IQuery<TResult>
{
  Type GetExecutorType();
}

public interface IQueryExecutor<TQuery, TResult>
  where TQuery : IQuery<TResult>
{
  Task<TResult> Execute(TQuery query);
}

public class FooQuery : IQuery<string[]>
{
  public Type GetExecutorType() => typeof(FooQueryExecutor);
}

public class FooQueryExecutor : IQueryExecutor<FooQuery, string[]>
{
  public Task<string[]> Execute(FooQuery query)
  {
    return Task.FromResult(Array.Empty<string>());
  }
}

public class Controller
{
  private readonly Dispatcher _dispatcher;

  public Controller(Dispatcher dispatcher)
  {
    _dispatcher = dispatcher;
  }

  public async Task<string[]> DoSomething(FooQuery query)
  {
    string[] strings = await _dispatcher.Query(query);
    return strings;
  }
}

public class Dispatcher
{
  private readonly IServiceProvider _serviceProvider;

  public Dispatcher(IServiceProvider serviceProvider)
  {
    _serviceProvider = serviceProvider;
  }

  public async Task<TResult> Query<TResult>(IQuery<TResult> query)
  {
    object? service = _serviceProvider.GetService(query.GetExecutorType());
    if (service is not IQueryExecutor<IQuery<TResult>, TResult> queryExecutor)
    {
      throw new Exception($"Executor for query {query.GetType()} not registered.");
    }

    return await queryExecutor.Execute(query);
  }
}

/*
namespace Engraved.Api.Temp;

public interface IQuery<TResult> { }

public interface IQueryExecutor<TQuery, TResult>
{
  Task<TResult> Execute(TQuery query);
}

public class Dispatcher
{
  private readonly IServiceProvider _serviceProvider;

  public Dispatcher(IServiceProvider serviceProvider)
  {
    _serviceProvider = serviceProvider;
  }

  public async Task<TResult> Query<TResult, TQuery>(TQuery query)
  {
    IQueryExecutor<TQuery, TResult> queryExecutor = _serviceProvider.GetService<>();
  }
}
*/
