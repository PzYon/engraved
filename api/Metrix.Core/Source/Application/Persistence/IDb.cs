using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Persistence;

public interface IDb
{
  List<Measurement> Measurements { get; }

  List<Metric> Metrics { get; }
}
