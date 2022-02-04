namespace Metrix.Core.Domain;

public interface IMetricsLoader
{
  Metric[] GetMetrics();

  Metric GetMetric(string metricKey);
}
