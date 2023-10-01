using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Measurements.Upsert.Timer;

public class UpsertTimerMeasurementCommand : BaseUpsertMeasurementCommand
{
  public DateTime? StartDate { get; set; }

  public DateTime? EndDate { get; set; }

  public override ICommandExecutor CreateExecutor()
  {
    return new UpsertTimerMeasurementCommandExecutor(this);
  }

  public override JournalType GetSupportedJournalType()
  {
    return JournalType.Timer;
  }
}
