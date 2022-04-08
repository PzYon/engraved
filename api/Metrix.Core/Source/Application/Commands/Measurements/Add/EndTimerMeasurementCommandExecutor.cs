using Metrix.Core.Application.Commands.Metrics;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public class EndTimerMeasurementCommandExecutor : ICommandExecutor
{
  private readonly EndTimerMeasurementCommand _command;

  public EndTimerMeasurementCommandExecutor(EndTimerMeasurementCommand command)
  {
    _command = command;
  }

  public void Execute(IDb db)
  {
    var metric = MetricUtil.LoadAndValidateMetric<TimerMetric>(db, _command, _command.MetricKey);

    if (metric.Type != MetricType.Timer)
    {
      throw new InvalidCommandException(
        _command,
        $"Command with metric type \"{MetricType.Timer}\" is not compatible with metric of type \"{metric.Type}\"."
      );
    }

    TimerMeasurement? measurement = db.Measurements
      .OfType<TimerMeasurement>()
      .FirstOrDefault(m => m.MetricKey == metric.Key && m.EndDate == null);

    if (measurement == null)
    {
      throw new InvalidCommandException(_command, $"Metric \"{metric.Key}\" has no started timer.");
    }

    measurement.EndDate = DateTime.UtcNow;

    metric.StartDate = null;
  }
}
