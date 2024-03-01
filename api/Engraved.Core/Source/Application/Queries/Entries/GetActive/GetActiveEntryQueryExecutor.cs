using Engraved.Core.Application.Commands.Entries.Upsert.Timer;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries.Entries.GetAllJournal;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Entries.GetActive;

public class GetActiveEntryQueryExecutor(IRepository repository) : IQueryExecutor<IEntry?, GetActiveEntryQuery>
{
  public bool DisableCache => false;

  public async Task<IEntry?> Execute(GetActiveEntryQuery query)
  {
    if (string.IsNullOrEmpty(query.JournalId))
    {
      throw new InvalidQueryException(
        query,
        $"{nameof(GetAllJournalEntriesQuery.JournalId)} must be specified."
      );
    }

    IJournal? journal = await repository.GetJournal(query.JournalId);

    if (journal == null)
    {
      throw new InvalidQueryException(
        query,
        $"Journal with key \"{query.JournalId}\" does not exist."
      );
    }

    if (journal.Type != JournalType.Timer)
    {
      return null;
    }

    return await UpsertTimerEntryCommandExecutor.GetActiveEntry(repository, (TimerJournal) journal);
  }
}
