namespace Metrix.Core.Domain.Metrics;

public class MetricsStore : IMetricsStore
{
  private readonly List<Metric> _metrics;

  public MetricsStore(List<Metric> metrics)
  {
    _metrics = metrics;
  }

  public Metric[] GetAll()
  {
    return _metrics.ToArray();
  }

  public Metric Get(string metricKey)
  {
    return _metrics.First(m => m.Key == metricKey);
  }

  public void Add(Metric metric)
  {
    _metrics.Add(metric);
  }
}
