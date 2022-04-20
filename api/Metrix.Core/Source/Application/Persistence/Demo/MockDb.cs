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

  public async Task<IMetric> GetMetric(string metricKey)
  {
    return Metrics.FirstOrDefault(m => m.Key == metricKey);
  }

  public async Task<IMeasurement[]> GetAllMeasurements(string metricKey)
  {
    return Measurements.Where(m => m.MetricKey == metricKey).ToArray();
  }

  public async Task AddMetric(IMetric metric)
  {
    Metrics.Add(metric);
  }

  public async Task UpdateMetric(IMetric metric)
  {
    // nothing to do here as metric is updated by reference and
    // hence implicitly updated in "List<IMetric> Metrics"
  }

  public async Task AddMeasurement<TMeasurement>(TMeasurement measurement) where TMeasurement : IMeasurement
  {
    Measurements.Add(measurement);
  }
}
