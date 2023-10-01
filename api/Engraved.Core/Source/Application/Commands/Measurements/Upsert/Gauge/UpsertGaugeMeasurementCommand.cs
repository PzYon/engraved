using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Measurements.Upsert.Gauge;

public class UpsertGaugeMeasurementCommand : BaseUpsertMeasurementCommand
{
  public double? Value { get; set; }

  public override JournalType GetSupportedJournalType()
  {
    return JournalType.Gauge;
  }

  public override ICommandExecutor CreateExecutor()
  {
    return new UpsertGaugeMeasurementCommandExecutor(this);
  }
}
