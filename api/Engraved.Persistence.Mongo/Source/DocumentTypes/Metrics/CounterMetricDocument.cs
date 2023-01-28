using Engraved.Core.Domain.Metrics;

namespace Engraved.Persistence.Mongo.DocumentTypes.Metrics;

public class CounterMetricDocument : MetricDocument
{
  public override MetricType Type => MetricType.Counter;
}
