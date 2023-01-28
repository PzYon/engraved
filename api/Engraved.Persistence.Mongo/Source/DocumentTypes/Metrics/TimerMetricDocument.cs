using Engraved.Core.Domain.Metrics;

namespace Engraved.Persistence.Mongo.DocumentTypes.Metrics;

public class TimerMetricDocument : MetricDocument
{
  public override MetricType Type => MetricType.Timer;

  public DateTime? StartDate { get; set; }
}
