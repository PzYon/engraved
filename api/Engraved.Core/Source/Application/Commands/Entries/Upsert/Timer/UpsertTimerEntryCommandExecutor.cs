using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.Timer;

public class UpsertTimerEntryCommandExecutor : BaseUpsertEntryCommandExecutor<
  UpsertTimerEntryCommand,
  TimerEntry,
  TimerJournal
>
{
  public UpsertTimerEntryCommandExecutor(UpsertTimerEntryCommand command) : base(command) { }

  protected override async Task<TimerEntry?> LoadEntryToUpdate(IRepository repository, TimerJournal journal)
  {
    return await GetActiveEntry(repository, journal);
  }

  protected override void SetTypeSpecificValues(IDateService dateService, TimerEntry entry)
  {
    if (string.IsNullOrEmpty(entry.Id))
    {
      if (Command.StartDate == null)
      {
        entry.StartDate = dateService.UtcNow;
        entry.DateTime = dateService.UtcNow;
        return;
      }

      entry.StartDate = Command.StartDate;
      entry.DateTime = Command.StartDate;
      entry.EndDate = Command.EndDate;
      return;
    }

    if (entry.EndDate == null && Command.EndDate == null)
    {
      entry.EndDate = dateService.UtcNow;
      return;
    }

    entry.StartDate = Command.StartDate;
    entry.DateTime = Command.StartDate;
    entry.EndDate = Command.EndDate;
  }

  public static async Task<TimerEntry?> GetActiveEntry(IRepository repository, TimerJournal journal)
  {
    // we get all entries here from the db and do the following filtering
    // in memory. this could be improved, however it would require new method(s)
    // in IDb. for the time being we will skip that.
    IEntry[] allEntries = await repository.GetAllEntries(journal.Id!, null, null, null);

    return allEntries
      .OfType<TimerEntry>()
      .FirstOrDefault(m => m.EndDate == null);
  }
}
