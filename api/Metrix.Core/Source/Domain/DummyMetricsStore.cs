namespace Metrix.Core.Domain;

public class DummyMetricsStore : IMetricsStore
{
  private static readonly List<Metric> _metrics = Enumerable.Range(0, Random.Shared.Next(5, 30))
    .Select(i => new Metric
    {
      Description = LoremUtil.LoremIpsum(0, 12, 1, 3),
      Key = "key" + i,
      Name = LoremUtil.LoremIpsum(1, 3, 1, 1),
      Type = MetricType.Gauge,
      Unit = "kg"
    })
    .ToList();

  public Metric[] GetMetrics()
  {
    return _metrics.ToArray();
  }

  public Metric GetMetric(string metricKey)
  {
    return _metrics.First(m => m.Key == metricKey);
  }

  public void Create(Metric metric)
  {
    _metrics.Add(metric);
  }
}
