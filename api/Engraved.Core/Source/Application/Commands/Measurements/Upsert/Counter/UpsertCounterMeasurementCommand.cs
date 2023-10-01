using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Measurements.Upsert.Counter;

public class UpsertCounterMeasurementCommand : BaseUpsertMeasurementCommand
{
  public override JournalType GetSupportedJournalType()
  {
    return JournalType.Counter;
  }

  public override ICommandExecutor CreateExecutor()
  {
    return new UpsertCounterMeasurementCommandExecutor(this);
  }
}
