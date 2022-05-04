using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Persistence;

public interface IRepository
{
  Task<IMetric[]> GetAllMetrics();

  Task<IMetric?> GetMetric(string metricId);

  Task<IMeasurement[]> GetAllMeasurements(string metricId);

  Task<UpsertResult> UpsertMetric(IMetric metric);

  Task<UpsertResult> UpsertMeasurement<TMeasurement>(TMeasurement measurement) where TMeasurement : IMeasurement;
}
