using Engraved.Core.Domain.Metrics;

namespace Engraved.Persistence.Mongo.DocumentTypes.Metrics;

public class GaugeMetricDocument : MetricDocument
{
  public override MetricType Type => MetricType.Gauge;
}
