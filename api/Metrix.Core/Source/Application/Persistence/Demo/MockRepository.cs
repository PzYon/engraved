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

  public Task<UpsertResult> UpsertMetric(IMetric metric)
  {
    if (string.IsNullOrEmpty(metric.Id))
    {
      metric.Id = GenerateId();
    }
    else
    {
      RemoveMetric(metric);
    }

    Metrics.Add(metric);

    return Task.FromResult(new UpsertResult { EntityId = metric.Id });
  }

  public Task<UpsertResult> UpsertMeasurement<TMeasurement>(TMeasurement measurement) where TMeasurement : IMeasurement
  {
    if (string.IsNullOrEmpty(measurement.Id))
    {
      measurement.Id = GenerateId();
    }
    else
    {
      RemoveMeasurement(measurement);
    }

    Measurements.Add(measurement);

    return Task.FromResult(new UpsertResult() { EntityId = measurement.Id });
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

  private void RemoveMetric<TMetric>(TMetric metric) where TMetric : IMetric
  {
    if (string.IsNullOrEmpty(metric.Id))
    {
      return;
    }

    IMetric? firstOrDefault = Metrics.FirstOrDefault(m => m.Id == metric.Id);
    if (firstOrDefault == null)
    {
      return;
    }

    Metrics.Remove(firstOrDefault);
  }

  private string GenerateId()
  {
    return Guid.NewGuid().ToString("N");
  }
}
