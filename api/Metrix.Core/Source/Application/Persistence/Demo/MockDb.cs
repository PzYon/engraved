using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Persistence.Demo;

public class MockDb : IDb
{
  public List<IMeasurement> Measurements { get; } = new();

  public List<IMetric> Metrics { get; } = new();

  public Task<IMetric[]> GetAllMetrics()
  {
    return Task.FromResult(Metrics.ToArray());
  }

  public Task<IMetric> GetMetric(string metricKey)
  {
    return Task.FromResult(Metrics.FirstOrDefault(m => m.Key == metricKey));
  }
}
