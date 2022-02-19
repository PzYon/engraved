namespace Metrix.Core.Domain;

public class DummyMetricsLoader : IMetricsLoader
{
  private static readonly Metric[] _metrics = Enumerable.Range(0, Random.Shared.Next(5, 30))
    .Select(i => new Metric
    {
      Description = LoremUtil.LoremIpsum(0, 12, 1, 3),
      Key = "key" + i,
      Name = LoremUtil.LoremIpsum(1, 3, 1, 1),
      Type = MetricType.Gauge,
      Unit = "kg"
    })
    .ToArray();

  public Metric[] GetMetrics()
  {
    return _metrics;
  }

  public Metric GetMetric(string metricKey)
  {
    return _metrics.First(m => m.Key == metricKey);
  }

}
