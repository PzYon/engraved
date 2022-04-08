namespace Metrix.Core.Domain.Metrics;

public class CounterMetric : BaseMetric
{
  public CounterMetric()
  {
    Type = MetricType.Counter;
  }
}
