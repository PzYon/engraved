using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Persistence.Demo;

public class MockRepository : IRepository
{
  public List<IMeasurement> Measurements { get; } = new();

  public List<IMetric> Metrics { get; } = new();

  public Task<IMetric[]> GetAllMetrics()
  {
    return Task.FromResult(Metrics.ToArray());
  }

  public Task<IMetric?> GetMetric(string metricKey)
  {
    return Task.FromResult(Metrics.FirstOrDefault(m => m.Key == metricKey));
  }

  public Task<IMeasurement[]> GetAllMeasurements(string metricKey)
  {
    return Task.FromResult(Measurements.Where(m => m.MetricKey == metricKey).ToArray());
  }

  public Task AddMetric(IMetric metric)
  {
    Metrics.Add(metric);
    return Task.CompletedTask;
  }

  public Task UpdateMetric(IMetric metric)
  {
    // nothing to do here as metric is updated by reference and
    // hence implicitly updated in "List<IMetric> Metrics"

    return Task.CompletedTask;
  }

  public Task AddMeasurement<TMeasurement>(TMeasurement measurement) where TMeasurement : IMeasurement
  {
    Measurements.Add(measurement);

    return Task.CompletedTask;
  }
}
