using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Persistence;

public interface IDb
{
  Task<IMetric[]> GetAllMetrics();

  Task<IMetric?> GetMetric(string metricKey);

  Task<IMeasurement[]> GetAllMeasurements(string metricKey);
  
  Task AddMetric(IMetric metric);

  Task UpdateMetric(IMetric metric);
  
  Task AddMeasurement<TMeasurement>(TMeasurement measurement) where TMeasurement : IMeasurement;
}
