using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Persistence;

public interface IDb
{
  List<BaseMeasurement> Measurements { get; }

  List<Metric> Metrics { get; }
}
