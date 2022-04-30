using Metrix.Core.Application.Commands.Metrics;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add.Timer.End;

public class EndTimerMeasurementCommandExecutor : ICommandExecutor
{
  private readonly EndTimerMeasurementCommand _command;

  public EndTimerMeasurementCommandExecutor(EndTimerMeasurementCommand command)
  {
    _command = command;
  }

  public async Task Execute(IRepository repository, IDateService dateService)
  {
    var metric = await MetricUtil.LoadAndValidateMetric<TimerMetric>(repository, _command, _command.MetricKey);

    if (metric.Type != MetricType.Timer)
    {
      throw new InvalidCommandException(
        _command,
        $"Command with metric type \"{MetricType.Timer}\" is not compatible with metric of type \"{metric.Type}\"."
      );
    }

    // we get all measurements here from the db and do the following filtering
    // in memory. this could be improved, however it would require new method(s)
    // in IDb. for the time being we will skip that.
    IMeasurement[] allMeasurements = await repository.GetAllMeasurements(metric.Key);

    TimerMeasurement? measurement = allMeasurements
      .OfType<TimerMeasurement>()
      .FirstOrDefault(m => m.EndDate == null);

    if (measurement == null)
    {
      throw new InvalidCommandException(_command, $"Metric \"{metric.Key}\" has no started timer.");
    }

    measurement.EndDate = dateService.UtcNow;

    metric.StartDate = null;

    await repository.UpdateMeasurement(measurement);
  }
}
