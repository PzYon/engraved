using Engraved.Core.Application.Persistence;

namespace Engraved.Core.Application.Commands.Metrics.Delete;

public class DeleteMetricCommandExecutor : ICommandExecutor
{
  private readonly DeleteMetricCommand _command;

  public DeleteMetricCommandExecutor(DeleteMetricCommand command)
  {
    _command = command;
  }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    await repository.DeleteMetric(_command.Id);

    return new CommandResult { EntityId = _command.Id };
  }
}
