using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Metrics;

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
    IMetric? targetMetric = await repository.GetMetric(_command.TargetMetricId);
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

    measurement.MetricId = targetMetric.Id!;

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
    IMetric targetMetric
  )
  {
    IMetric sourceMetric = (await repository.GetMetric(measurement.MetricId))!;

    return targetMetric.Permissions.GetUserIdsWithAccess()
      .Union(sourceMetric.Permissions.GetUserIdsWithAccess())
      .Distinct()
      .ToArray();
  }
}
