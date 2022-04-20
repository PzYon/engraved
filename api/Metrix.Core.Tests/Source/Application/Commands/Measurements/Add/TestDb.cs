using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add;

internal class TestDb : IDb
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
