using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Commands.Measurements.Upsert.Counter;

public class UpsertCounterMeasurementCommandExecutor : BaseUpsertMeasurementCommandExecutor<
  UpsertCounterMeasurementCommand,
  CounterMeasurement,
  CounterMetric
>
{
  public UpsertCounterMeasurementCommandExecutor(UpsertCounterMeasurementCommand command) : base(command) { }

  protected override void SetTypeSpecificValues(IDateService dateService, CounterMeasurement measurement) { }
}
