using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Persistence;

public interface IRepository
{
  Task<IMetric[]> GetAllMetrics();

  Task<IMetric?> GetMetric(string metricKey);

  Task<IMeasurement[]> GetAllMeasurements(string metricKey);

  Task AddMetric(IMetric metric);

  Task UpdateMetric(IMetric metric);

  Task UpsertMeasurement<TMeasurement>(TMeasurement measurement) where TMeasurement : IMeasurement;
}
