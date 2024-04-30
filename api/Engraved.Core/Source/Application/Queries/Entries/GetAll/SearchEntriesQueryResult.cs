using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Entries.GetAll;

public class SearchEntriesQueryResult
{
  public IJournal[] Journals { get; set; } = Array.Empty<IJournal>();

  public IEntry[] Entries { get; set; } = Array.Empty<IEntry>();
}
