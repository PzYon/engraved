namespace Metrix.Core.Domain.Metrics;

public interface IMetricsStore
{
  Metric[] GetAll();

  Metric Get(string metricKey);

  void Add(Metric metric);
}
