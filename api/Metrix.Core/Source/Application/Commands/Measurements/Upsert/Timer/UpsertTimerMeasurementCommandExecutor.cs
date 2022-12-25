using Metrix.Core.Application.Commands.Measurements.Upsert.Timer;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add.Timer.Upsert;

public class UpsertTimerMeasurementCommandExecutor : BaseUpsertMeasurementCommandExecutor<
  UpsertTimerMeasurementCommand,
  TimerMeasurement,
  TimerMetric
>
{
  public UpsertTimerMeasurementCommandExecutor(UpsertTimerMeasurementCommand command) : base(command) { }

  protected override async Task<TimerMeasurement?> LoadMeasurementToUpdate(IRepository repository, TimerMetric metric)
  {
    // we get all measurements here from the db and do the following filtering
    // in memory. this could be improved, however it would require new method(s)
    // in IDb. for the time being we will skip that.
    IMeasurement[] allMeasurements = await repository.GetAllMeasurements(metric.Id!, null, null, null);

    return allMeasurements
      .OfType<TimerMeasurement>()
      .FirstOrDefault(m => m.EndDate != null || m.StartDate != null);
  }

  protected override void SetTypeSpecificValues(TimerMeasurement measurement, IDateService dateService)
  {
    if (!string.IsNullOrEmpty(Command.Id))
    {
      measurement.StartDate = Command.StartDate;
      measurement.EndDate = Command.EndDate;
      return;
    }

    if (measurement.StartDate == null)
    {
      measurement.StartDate = dateService.UtcNow;
    }
    else
    {
      measurement.EndDate = dateService.UtcNow;
    }
  }
}
