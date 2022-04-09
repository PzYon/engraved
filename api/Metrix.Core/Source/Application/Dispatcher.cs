using Metrix.Core.Application.Commands;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Queries;

namespace Metrix.Core.Application;

public class Dispatcher
{
  private readonly IDb _db;
  private readonly IDateService _dateService;

  public Dispatcher(IDb db, IDateService dateService)
  {
    _db = db;
    _dateService = dateService;
  }

  public TResult Query<TResult>(IQuery<TResult> query)
  {
    return query.CreateExecutor().Execute(_db);
  }

  public void Command(ICommand command)
  {
    command.CreateExecutor().Execute(_db, _dateService);
  }
}
