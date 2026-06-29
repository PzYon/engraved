using Engraved.Core.Application.Persistence;
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

    return await entryRepository.GetEntriesForJournal(
      query.JournalId,
      query.FromDate,
      query.ToDate,
      query.AttributeValues,
      query.SearchText
    );
  }
}
