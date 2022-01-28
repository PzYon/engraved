namespace Metrix.Core.Domain;

public interface IMetricsLoader
{
  Metric[] GetMetrics();
}
