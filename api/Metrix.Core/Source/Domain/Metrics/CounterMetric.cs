namespace Metrix.Core.Domain.Metrics;

public class CounterMetric : BaseMetric
{
  public override MetricType Type => MetricType.Counter;
}
