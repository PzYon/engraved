using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;

namespace Engraved.Core.Application.Commands.Measurements.Move;

public class MoveMeasurementCommandExecutor : ICommandExecutor
{
  private readonly MoveMeasurementCommand _command;

  public MoveMeasurementCommandExecutor(MoveMeasurementCommand command)
  {
    _command = command;
  }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    // can user access target journal?
    IJournal? targetJournal = await repository.GetJournal(_command.TargetJournalId);
    if (targetJournal == null)
    {
      return new CommandResult();
    }

    // can user access measurement?
    IMeasurement? measurement = await repository.GetMeasurement(_command.MeasurementId);
    if (measurement == null)
    {
      return new CommandResult();
    }

    // update source journal EditedOn
    IJournal sourceJournal = (await repository.GetJournal(measurement.ParentId))!;
    sourceJournal.EditedOn = dateService.UtcNow;
    await repository.UpsertJournal(sourceJournal);

    // update target journal EditedOn
    targetJournal.EditedOn = dateService.UtcNow;
    await repository.UpsertJournal(targetJournal);

    // update measurement
    measurement.EditedOn = dateService.UtcNow;
    measurement.DateTime = dateService.UtcNow;
    measurement.ParentId = targetJournal.Id!;
    await repository.UpsertMeasurement(measurement);

    string[] affectedUserIds = await GetAffectedUserIds(repository, measurement, targetJournal);

    return new CommandResult(
      _command.MeasurementId,
      affectedUserIds
    );
  }

  private static async Task<string[]> GetAffectedUserIds(
    IRepository repository,
    IMeasurement measurement,
    IJournal targetJournal
  )
  {
    IJournal sourceJournal = (await repository.GetJournal(measurement.ParentId))!;

    return targetJournal.Permissions.GetUserIdsWithAccess()
      .Union(sourceJournal.Permissions.GetUserIdsWithAccess())
      .Distinct()
      .ToArray();
  }
}
