using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Entries.Get;

public class GetEntryQueryExecutor(IEntryRepository entryRepository, IJournalRepository journalRepository)
  : IQueryExecutor<IEntry?, GetEntryQuery>
{
  public bool DisableCache => false;

  public async Task<IEntry?> Execute(GetEntryQuery query)
  {
    if (string.IsNullOrEmpty(query.EntryId))
    {
      throw new InvalidQueryException(
        query,
        $"{nameof(GetEntryQuery.EntryId)} must be specified."
      );
    }

    IEntry? entry = await entryRepository.GetEntry(query.EntryId);
    if (entry == null)
    {
      return null;
    }

    // Permission gate (not redundant): GetEntry is an unscoped primitive, so this is where read
    // access is enforced for the single-entry endpoint. GetJournal is scoped, so it returns null
    // when the current user cannot read the parent journal - in which case we hide the entry.
    IJournal? journal = await journalRepository.GetJournal(entry.ParentId);
    if (journal == null)
    {
      return null;
    }

    return entry;
  }
}
