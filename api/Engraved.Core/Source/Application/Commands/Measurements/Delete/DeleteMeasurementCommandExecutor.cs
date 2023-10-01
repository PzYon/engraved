using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;

namespace Engraved.Core.Application.Commands.Measurements.Delete;

public class DeleteMeasurementCommandExecutor : ICommandExecutor
{
  private readonly DeleteMeasurementCommand _command;

  public DeleteMeasurementCommandExecutor(DeleteMeasurementCommand command)
  {
    _command = command;
  }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    IMeasurement? measurement = await repository.GetMeasurement(_command.Id);
    if (measurement == null)
    {
      return new CommandResult();
    }

    await repository.DeleteMeasurement(_command.Id);

    IJournal journal = (await repository.GetJournal(measurement.ParentId))!;
    journal.EditedOn = dateService.UtcNow;

    await repository.UpsertJournal(journal);

    return new CommandResult(_command.Id, journal.Permissions.GetUserIdsWithAccess());
  }
}
