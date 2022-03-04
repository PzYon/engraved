using Metrix.Core.Application.Commands;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Queries;

namespace Metrix.Core.Application;

public class Dispatcher
{
  private readonly IDb _db;

  public Dispatcher(IDb db)
  {
    _db = db;
  }

  public TResult Query<TQuery, TResult>(TQuery query) where TQuery : IQuery<TQuery, TResult>
  {
    return query.CreateExecutor().Execute(_db, query);
  }

  public void Command<TCommand>(TCommand command) where TCommand : ICommand<TCommand>
  {
    command.CreateExecutor().Execute(_db, command);
  }
}