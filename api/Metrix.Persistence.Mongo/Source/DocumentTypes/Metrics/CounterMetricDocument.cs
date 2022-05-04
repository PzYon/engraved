using Metrix.Core.Domain.Metrics;

namespace Metrix.Persistence.Mongo.DocumentTypes.Metrics;

public class CounterMetricDocument : MetricDocument
{
  public override MetricType Type => MetricType.Counter;
}
