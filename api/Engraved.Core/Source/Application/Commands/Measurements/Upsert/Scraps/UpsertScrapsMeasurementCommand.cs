using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Commands.Measurements.Upsert.Scraps;

public class UpsertScrapsMeasurementCommand : BaseUpsertMeasurementCommand
{
  public string Title { get; set; } = null!;

  public ScrapType ScrapType { get; set; } = ScrapType.Markdown;
  
  public override MetricType GetSupportedMetricType()
  {
    return MetricType.Scraps;
  }

  public override ICommandExecutor CreateExecutor()
  {
    return new UpsertScrapsMeasurementCommandExecutor(this);
  }
}
