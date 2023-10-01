using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;

namespace Engraved.Core.Application.Queries.Activities.Get;

public class GetActivitiesQueryResult
{
  public IJournal[] Journals { get; set; } = Array.Empty<IJournal>();

  public IMeasurement[] Measurements { get; set; } = Array.Empty<IMeasurement>();
}
