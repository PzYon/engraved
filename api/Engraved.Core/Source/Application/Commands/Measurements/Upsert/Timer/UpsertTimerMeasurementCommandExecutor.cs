using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;

namespace Engraved.Core.Application.Commands.Measurements.Upsert.Timer;

public class UpsertTimerMeasurementCommandExecutor : BaseUpsertMeasurementCommandExecutor<
  UpsertTimerMeasurementCommand,
  TimerMeasurement,
  TimerJournal
>
{
  public UpsertTimerMeasurementCommandExecutor(UpsertTimerMeasurementCommand command) : base(command) { }

  protected override async Task<TimerMeasurement?> LoadMeasurementToUpdate(IRepository repository, TimerJournal journal)
  {
    return await GetActiveMeasurement(repository, journal);
  }

  protected override void SetTypeSpecificValues(IDateService dateService, TimerMeasurement measurement)
  {
    if (string.IsNullOrEmpty(measurement.Id))
    {
      if (Command.StartDate == null)
      {
        measurement.StartDate = dateService.UtcNow;
        measurement.DateTime = dateService.UtcNow;
        return;
      }

      measurement.StartDate = Command.StartDate;
      measurement.DateTime = Command.StartDate;
      measurement.EndDate = Command.EndDate;
      return;
    }

    if (measurement.EndDate == null && Command.EndDate == null)
    {
      measurement.EndDate = dateService.UtcNow;
      return;
    }

    measurement.StartDate = Command.StartDate;
    measurement.DateTime = Command.StartDate;
    measurement.EndDate = Command.EndDate;
  }

  public static async Task<TimerMeasurement?> GetActiveMeasurement(IRepository repository, TimerJournal journal)
  {
    // we get all measurements here from the db and do the following filtering
    // in memory. this could be improved, however it would require new method(s)
    // in IDb. for the time being we will skip that.
    IMeasurement[] allMeasurements = await repository.GetAllMeasurements(journal.Id!, null, null, null);

    return allMeasurements
      .OfType<TimerMeasurement>()
      .FirstOrDefault(m => m.EndDate == null);
  }
}
