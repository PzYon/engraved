using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Commands.Measurements.Upsert.Scraps;

public class UpsertScrapsMeasurementCommand : BaseUpsertMeasurementCommand
{
  public string Title { get; set; } = null!;
  
  public override MetricType GetSupportedMetricType()
  {
    return MetricType.Scraps;
  }

  public override ICommandExecutor CreateExecutor()
  {
    return new UpsertScrapsMeasurementCommandExecutor(this);
  }
}
