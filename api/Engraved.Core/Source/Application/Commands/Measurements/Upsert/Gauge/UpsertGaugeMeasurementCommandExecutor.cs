using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;

namespace Engraved.Core.Application.Commands.Measurements.Upsert.Gauge;

public class UpsertGaugeMeasurementCommandExecutor : BaseUpsertMeasurementCommandExecutor<
  UpsertGaugeMeasurementCommand,
  GaugeMeasurement,
  GaugeJournal
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
