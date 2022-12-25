using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Upsert.Gauge;

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

  protected override void SetTypeSpecificValues(GaugeMeasurement measurement, IDateService dateService)
  {
    measurement.Value = Command.Value!.Value;
  }
}
