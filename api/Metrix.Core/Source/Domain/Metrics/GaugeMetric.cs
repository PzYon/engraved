namespace Metrix.Core.Domain.Metrics;

public class GaugeMetric : BaseMetric
{
  public override MetricType Type => MetricType.Gauge;

}
