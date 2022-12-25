using Metrix.Core.Application.Commands.Measurements.Upsert.Counter;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add.Counter;

public class UpsertCounterMeasurementCommandExecutor : BaseUpsertMeasurementCommandExecutor<
  UpsertCounterMeasurementCommand,
  CounterMeasurement,
  CounterMetric
>
{
  public UpsertCounterMeasurementCommandExecutor(UpsertCounterMeasurementCommand command) : base(command) { }

  protected override void SetTypeSpecificValues(CounterMeasurement measurement, IDateService dateService) { }
}
