using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Queries.Activities.Get;

public class GetActivitiesQueryResult
{
  public IMetric[] Metrics { get; set; } = Array.Empty<IMetric>();

  public IMeasurement[] Measurements { get; set; } = Array.Empty<IMeasurement>();
}
