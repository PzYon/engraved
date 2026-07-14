using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Entries.GetAllJournal;

public class GetAllJournalEntriesQueryExecutor(
  IJournalRepository journalRepository,
  IEntryRepository entryRepository
)
  : IQueryExecutor<IEntry[], GetAllJournalEntriesQuery>
{
  public bool DisableCache => false;

  public async Task<IEntry[]> Execute(GetAllJournalEntriesQuery query)
  {
    if (string.IsNullOrEmpty(query.JournalId))
    {
      throw new InvalidQueryException(
        query,
        $"{nameof(GetAllJournalEntriesQuery.JournalId)} must be specified."
      );
    }

    IJournal? journal = await journalRepository.GetJournal(query.JournalId);

    if (journal == null)
    {
      throw new InvalidQueryException(
        query,
        $"Journal with key \"{query.JournalId}\" does not exist."
      );
    }

    // Scraps are notes that get revisited and edited over time, so the most recently edited one
    // should surface first. Other journal types show a value/measurement history, where the
    // entry's own DateTime (not when it was last edited) is what matters for ordering.
    SortEntriesBy sortOrder = journal.Type == JournalType.Scraps
      ? SortEntriesBy.EditedOn
      : SortEntriesBy.DateTime;

    return await entryRepository.GetEntriesForJournal(
      query.JournalId,
      query.FromDate,
      query.ToDate,
      query.AttributeValues,
      query.SearchText,
      sortOrder
    );
  }
}
