using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;

namespace Engraved.Core.Application.Commands.Measurements.Upsert.Counter;

public class UpsertCounterMeasurementCommandExecutor : BaseUpsertMeasurementCommandExecutor<
  UpsertCounterMeasurementCommand,
  CounterMeasurement,
  CounterJournal
>
{
  public UpsertCounterMeasurementCommandExecutor(UpsertCounterMeasurementCommand command) : base(command) { }

  protected override void SetTypeSpecificValues(IDateService dateService, CounterMeasurement measurement) { }
}
