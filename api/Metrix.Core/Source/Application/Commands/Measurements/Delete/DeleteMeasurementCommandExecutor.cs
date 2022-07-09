using Metrix.Core.Application.Persistence;

namespace Metrix.Core.Application.Commands.Measurements.Delete;

public class DeleteMeasurementCommandExecutor : ICommandExecutor
{
  private readonly DeleteMeasurementCommand _command;

  public DeleteMeasurementCommandExecutor(DeleteMeasurementCommand command)
  {
    _command = command;
  }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    await repository.DeleteMeasurement(_command.Id);

    return new CommandResult { EntityId = _command.Id };
  }
}
