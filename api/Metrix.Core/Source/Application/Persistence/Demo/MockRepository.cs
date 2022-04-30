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

  public Task<IMetric?> GetMetric(string metricId)
  {
    return Task.FromResult(Metrics.FirstOrDefault(m => m.Id == metricId));
  }

  public Task<IMeasurement[]> GetAllMeasurements(string metricId)
  {
    return Task.FromResult(Measurements.Where(m => m.MetricId == metricId).ToArray());
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

  public Task UpsertMeasurement<TMeasurement>(TMeasurement measurement) where TMeasurement : IMeasurement
  {
    RemoveMeasurement(measurement);

    Measurements.Add(measurement);

    return Task.CompletedTask;
  }

  private void RemoveMeasurement<TMeasurement>(TMeasurement measurement) where TMeasurement : IMeasurement
  {
    if (string.IsNullOrEmpty(measurement.Id))
    {
      return;
    }

    IMeasurement? firstOrDefault = Measurements.FirstOrDefault(m => m.Id == measurement.Id);
    if (firstOrDefault == null)
    {
      return;
    }

    Measurements.Remove(firstOrDefault);
  }
}
