using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Commands.Measurements.Upsert.Gauge;

public class UpsertGaugeMeasurementCommandExecutor : BaseUpsertMeasurementCommandExecutor<
  UpsertGaugeMeasurementCommand,
  GaugeMeasurement,
  GaugeMetric
>
{
  public UpsertGaugeMeasurementCommandExecutor(UpsertGaugeMeasurementCommand command) : base(command) { }

  protected override Task PerformTypeSpecificValidation()
  {
    if (Command.Value == null)
    {
      throw CreateInvalidCommandException($"\"{nameof(UpsertGaugeMeasurementCommand.Value)}\" must be specified");
    }

    return Task.CompletedTask;
  }

  protected override void SetTypeSpecificValues(IDateService dateService, GaugeMeasurement measurement)
  {
    measurement.Value = Command.Value!.Value;
  }
}
