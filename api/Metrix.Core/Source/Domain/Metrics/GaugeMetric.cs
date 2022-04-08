namespace Metrix.Core.Domain.Metrics;

public class GaugeMetric : BaseMetric
{
  public GaugeMetric()
  {
    Type = MetricType.Gauge;
  }
}
