namespace Engraved.Api.Temp;

public interface IQuery { }

public interface IQueryExecutor<TResult, TQuery>
  where TQuery : IQuery
{
  Task<TResult> Execute(TQuery query);
}

public class FooQuery : IQuery { }

public class FooQueryExecutor : IQueryExecutor<string[], FooQuery>
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
    return await _dispatcher.Query<string[], FooQuery>(query);
  }
}

public class Dispatcher
{
  private readonly IServiceProvider _serviceProvider;

  public Dispatcher(IServiceProvider serviceProvider)
  {
    _serviceProvider = serviceProvider;
  }

  public async Task<TResult> Query<TResult, TQuery>(TQuery query) where TQuery : IQuery
  {
    var foo = _serviceProvider.GetService<IQueryExecutor<TResult, TQuery>>();
    
    return await foo.Execute(query);
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
