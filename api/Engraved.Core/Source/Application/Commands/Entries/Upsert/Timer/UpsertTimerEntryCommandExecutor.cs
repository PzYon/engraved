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
  public UpsertTimerEntryCommandExecutor(IRepository repository, IDateService dateService) : base(
    repository,
    dateService
  ) { }

  protected override async Task<TimerEntry?> LoadEntryToUpdate(UpsertTimerEntryCommand command, TimerJournal journal)
  {
    return await GetActiveEntry(Repository, journal);
  }

  protected override void SetTypeSpecificValues(UpsertTimerEntryCommand command, TimerEntry entry)
  {
    if (string.IsNullOrEmpty(entry.Id))
    {
      if (command.StartDate == null)
      {
        entry.StartDate = DateService.UtcNow;
        entry.DateTime = DateService.UtcNow;
        return;
      }

      entry.StartDate = command.StartDate;
      entry.DateTime = command.StartDate;
      entry.EndDate = command.EndDate;
      return;
    }

    if (entry.EndDate == null && command.EndDate == null)
    {
      entry.EndDate = DateService.UtcNow;
      return;
    }

    entry.StartDate = command.StartDate;
    entry.DateTime = command.StartDate;
    entry.EndDate = command.EndDate;
  }

  public static async Task<TimerEntry?> GetActiveEntry(IBaseRepository repository, TimerJournal journal)
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
