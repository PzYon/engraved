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
    // can user access target metric?
    IJournal? targetMetric = await repository.GetJournal(_command.TargetMetricId);
    if (targetMetric == null)
    {
      return new CommandResult();
    }

    // can user access measurement?
    IMeasurement? measurement = await repository.GetMeasurement(_command.MeasurementId);
    if (measurement == null)
    {
      return new CommandResult();
    }

    // update source metric EditedOn
    IJournal sourceJournal = (await repository.GetJournal(measurement.ParentId))!;
    sourceJournal.EditedOn = dateService.UtcNow;
    await repository.UpsertJournal(sourceJournal);

    // update target metric EditedOn
    targetMetric.EditedOn = dateService.UtcNow;
    await repository.UpsertJournal(targetMetric);

    // update measurement
    measurement.EditedOn = dateService.UtcNow;
    measurement.DateTime = dateService.UtcNow;
    measurement.ParentId = targetMetric.Id!;
    await repository.UpsertMeasurement(measurement);

    string[] affectedUserIds = await GetAffectedUserIds(repository, measurement, targetMetric);

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
