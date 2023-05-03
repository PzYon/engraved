using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Metrics;

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

    IMetric metric = (await repository.GetMetric(measurement.MetricId))!;
    metric.EditedOn = dateService.UtcNow;

    await repository.UpsertMetric(metric);

    return new CommandResult(_command.Id, metric.Permissions.GetUserIdsWithAccess());
  }
}
