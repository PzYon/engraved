using Metrix.Core.Application.Commands;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Queries;

namespace Metrix.Core.Application;

public class Dispatcher
{
  private readonly IRepository _repository;
  private readonly IDateService _dateService;

  public Dispatcher(IRepository repository, IDateService dateService)
  {
    _repository = repository;
    _dateService = dateService;
  }

  public async Task<TResult> Query<TResult>(IQuery<TResult> query)
  {
    return await query.CreateExecutor().Execute(_repository);
  }

  public async Task Command(ICommand command)
  {
    await command.CreateExecutor().Execute(_repository, _dateService);
  }
}
