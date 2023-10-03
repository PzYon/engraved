using Engraved.Core.Application.Commands.Entries.Upsert.Timer;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries.Entries.GetAllJournal;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Entries.GetActive;

public class GetActiveEntryQueryExecutor : IQueryExecutor<IEntry?>
{
  public bool DisableCache => false;

  private readonly GetActiveEntryQuery _query;

  public GetActiveEntryQueryExecutor(GetActiveEntryQuery query)
  {
    _query = query;
  }

  public async Task<IEntry?> Execute(IRepository repository)
  {
    if (string.IsNullOrEmpty(_query.JournalId))
    {
      throw new InvalidQueryException<IEntry?>(
        _query,
        $"{nameof(GetAllJournalEntriesQuery.JournalId)} must be specified."
      );
    }

    IJournal? journal = await repository.GetJournal(_query.JournalId);

    if (journal == null)
    {
      throw new InvalidQueryException<IEntry?>(
        _query,
        $"Journal with key \"{_query.JournalId}\" does not exist."
      );
    }

    if (journal.Type != JournalType.Timer)
    {
      return null;
    }

    var timerJournal = (TimerJournal) journal;
    return await UpsertTimerEntryCommandExecutor.GetActiveEntry(repository, timerJournal);
  }
}
