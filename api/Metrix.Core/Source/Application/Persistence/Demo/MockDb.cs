using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Persistence.Demo;

public class MockDb : IDb
{
  public List<IMeasurement> Measurements { get; } = new();

  public List<IMetric> Metrics { get; } = new();
}
