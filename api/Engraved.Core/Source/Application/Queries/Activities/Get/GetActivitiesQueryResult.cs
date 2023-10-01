using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Activities.Get;

public class GetActivitiesQueryResult
{
  public IJournal[] Journals { get; set; } = Array.Empty<IJournal>();

  public IEntry[] Entries { get; set; } = Array.Empty<IEntry>();
}
