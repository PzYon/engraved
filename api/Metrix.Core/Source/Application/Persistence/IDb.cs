using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Persistence;

public interface IDb
{
  List<IMeasurement> Measurements { get; }

  List<IMetric> Metrics { get; }

  Task<IMetric[]> GetAllMetrics();

  Task<IMetric> GetMetric(string metricKey);
}
