using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Entries.GetAll;

public class SearchEntriesQueryResult
{
  public IJournal[] Journals { get; set; } = [];

  public IEntry[] Entries { get; set; } = [];
}
