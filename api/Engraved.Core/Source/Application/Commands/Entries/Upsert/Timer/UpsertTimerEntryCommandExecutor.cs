using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.Timer;

public class UpsertTimerEntryCommandExecutor(IRepository repository, IDateService dateService)
  : BaseUpsertEntryCommandExecutor<
    UpsertTimerEntryCommand,
    TimerEntry,
    TimerJournal
  >(
    repository,
    dateService
  )
{
  protected override async Task<TimerEntry?> LoadEntryToUpdate(UpsertTimerEntryCommand command, TimerJournal journal)
  {
    return await GetActiveEntry(Repository, journal);
  }

  protected override void SetTypeSpecificValues(UpsertTimerEntryCommand command, TimerEntry entry)
  {
    if (IsNewWithBlankCommand(command, entry))
    {
      entry.StartDate = DateService.UtcNow;
      entry.DateTime = DateService.UtcNow;
      return;
    }

    if (IsAutoSetOfEndDate(command, entry))
    {
      entry.EndDate = DateService.UtcNow;
      return;
    }

    if (command.StartDate == null)
    {
      throw new InvalidCommandException(command, $"Cannot set {nameof(command.StartDate)} to null.");
    }

    entry.DateTime = command.StartDate;
    entry.StartDate = command.StartDate;
    entry.EndDate = command.EndDate;
  }

  private static bool IsNewWithBlankCommand(UpsertTimerEntryCommand command, TimerEntry entry)
  {
    return string.IsNullOrEmpty(entry.Id) && command.StartDate == null;
  }

  private static bool IsAutoSetOfEndDate(UpsertTimerEntryCommand command, TimerEntry entry)
  {
    return !string.IsNullOrEmpty(entry.Id)
           && (entry.StartDate == command.StartDate || command.StartDate == null)
           && entry.EndDate == null
           && command.EndDate == null;
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
