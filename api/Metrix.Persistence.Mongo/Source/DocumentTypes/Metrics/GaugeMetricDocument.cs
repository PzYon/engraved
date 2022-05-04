using Metrix.Core.Domain.Metrics;

namespace Metrix.Persistence.Mongo.DocumentTypes.Metrics;

public class GaugeMetricDocument : MetricDocument
{
  public override MetricType Type => MetricType.Gauge;
}
