using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Commands.Measurements.Upsert.Timer;

public class UpsertTimerMeasurementCommandExecutor : BaseUpsertMeasurementCommandExecutor<
  UpsertTimerMeasurementCommand,
  TimerMeasurement,
  TimerMetric
>
{
  public UpsertTimerMeasurementCommandExecutor(UpsertTimerMeasurementCommand command) : base(command) { }

  protected override async Task<TimerMeasurement?> LoadMeasurementToUpdate(IRepository repository, TimerMetric metric)
  {
    return await GetActiveMeasurement(repository, metric);
  }

  protected override void SetTypeSpecificValues(IDateService dateService, TimerMeasurement measurement)
  {
    if (!string.IsNullOrEmpty(Command.Id) && (Command.EndDate != null || Command.StartDate != null))
    {
      measurement.StartDate = Command.StartDate;
      measurement.DateTime = Command.StartDate ?? dateService.UtcNow;
      measurement.EndDate = Command.EndDate;
      return;
    }

    if (measurement.StartDate == null)
    {
      measurement.StartDate = dateService.UtcNow;
      measurement.DateTime = dateService.UtcNow;
    }
    else
    {
      measurement.EndDate = dateService.UtcNow;
    }
  }

  public static async Task<TimerMeasurement?> GetActiveMeasurement(IRepository repository, TimerMetric metric)
  {
    // we get all measurements here from the db and do the following filtering
    // in memory. this could be improved, however it would require new method(s)
    // in IDb. for the time being we will skip that.
    IMeasurement[] allMeasurements = await repository.GetAllMeasurements(metric.Id!, null, null, null);

    return allMeasurements
      .OfType<TimerMeasurement>()
      .FirstOrDefault(m => m.EndDate == null);
  }
}
