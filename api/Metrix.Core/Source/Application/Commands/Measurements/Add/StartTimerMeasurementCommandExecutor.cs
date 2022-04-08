using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public class StartTimerMeasurementCommandExecutor : BaseAddMeasurementCommandExecutor<
  StartTimerMeasurementCommand,
  TimerMeasurement
>
{
  public StartTimerMeasurementCommandExecutor(StartTimerMeasurementCommand command) : base(command) { }

  protected override void PerformAdditionalValidation(IDb db, IMetric metric)
  {
    if (db.Measurements
        .Where(m => m.MetricKey == metric.Key)
        .OfType<TimerMeasurement>()
        .Any(m => m.EndDate == null))
    {
      throw CreateInvalidCommandException($"Metric \"{metric.Key}\" already has a started timer.");
    }
  }

  protected override TimerMeasurement CreateMeasurement()
  {
    return new TimerMeasurement
    {
      StartDate = DateTime.UtcNow
    };
  }
}
