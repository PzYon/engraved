using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Commands.Measurements.Upsert.Scraps;

public class UpsertScrapsMeasurementCommandExecutor : BaseUpsertMeasurementCommandExecutor<
  UpsertScrapsMeasurementCommand,
  ScrapsMeasurement,
  ScrapsMetric
>
{
  public UpsertScrapsMeasurementCommandExecutor(UpsertScrapsMeasurementCommand command) : base(command) { }

  protected override Task PerformTypeSpecificValidation()
  {
    if (string.IsNullOrWhiteSpace(Command.Notes))
    {
      throw CreateInvalidCommandException($"\"{nameof(UpsertScrapsMeasurementCommand.Notes)}\" must be specified");
    }

    return Task.CompletedTask;
  }

  protected override void SetTypeSpecificValues(IDateService dateService, ScrapsMeasurement measurement)
  {
    measurement.Title = Command.Title;
    measurement.ScrapType = Command.ScrapType;
  }
}
