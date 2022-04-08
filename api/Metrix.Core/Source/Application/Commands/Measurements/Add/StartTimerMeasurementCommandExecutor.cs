using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public class StartTimerMeasurementCommandExecutor : BaseAddMeasurementCommandExecutor<
  StartTimerMeasurementCommand,
  TimerMeasurement,
  TimerMetric
>
{
  private readonly Lazy<DateTime> _utcNow = new(() => DateTime.UtcNow);

  public StartTimerMeasurementCommandExecutor(StartTimerMeasurementCommand command) : base(command) { }

  protected override void PerformAdditionalValidation(IDb db, TimerMetric metric)
  {
    if (db.Measurements
        .Where(m => m.MetricKey == metric.Key)
        .OfType<TimerMeasurement>()
        .Any(m => m.EndDate == null))
    {
      throw CreateInvalidCommandException($"Metric \"{metric.Key}\" already has a started timer.");
    }
  }

  protected override void UpdateMetric(TimerMetric metric)
  {
    metric.StartDate = _utcNow.Value;
  }

  protected override TimerMeasurement CreateMeasurement()
  {
    return new TimerMeasurement
    {
      StartDate = _utcNow.Value
    };
  }
}
