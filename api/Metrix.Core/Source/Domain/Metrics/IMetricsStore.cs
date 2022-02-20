namespace Metrix.Core.Domain.Metrics;

public interface IMetricsStore
{
  Metric[] GetMetrics();

  Metric GetMetric(string metricKey);

  void Create(Metric metric);
}
