using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add.Timer.Start;

public class StartTimerMeasurementCommandExecutor : BaseUpsertMeasurementCommandExecutor<
  StartTimerMeasurementCommand,
  TimerMeasurement,
  TimerMetric
>
{
  public StartTimerMeasurementCommandExecutor(StartTimerMeasurementCommand command) : base(command) { }

  protected override async Task PerformAdditionalValidation(IRepository repository, TimerMetric metric)
  {
    // we get all measurements here from the db and do the following filtering
    // in memory. this could be improved, however it would require new method(s)
    // in IRepository. for the time being we will skip that.
    IMeasurement[] allMeasurements = await repository.GetAllMeasurements(metric.Key);
    
    if (allMeasurements
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
