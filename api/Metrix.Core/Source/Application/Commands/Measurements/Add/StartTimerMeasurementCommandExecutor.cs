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

  protected override void UpdateMetric(TimerMetric metric, IDateService dateService)
  {
    metric.StartDate = dateService.UtcNow;
  }

  protected override TimerMeasurement CreateMeasurement(IDateService dateService)
  {
    return new TimerMeasurement
    {
      StartDate = dateService.UtcNow
    };
  }
}
