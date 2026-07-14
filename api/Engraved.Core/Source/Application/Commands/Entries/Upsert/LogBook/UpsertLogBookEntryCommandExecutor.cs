using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.LogBook;

public class UpsertLogBookEntryCommandExecutor(
  IJournalRepository journalRepository,
  IEntryRepository entryRepository,
  IDateService dateService
)
  : BaseUpsertEntryCommandExecutor<
    UpsertLogBookEntryCommand,
    LogBookEntry,
    LogBookJournal
  >(
    journalRepository,
    entryRepository,
    dateService
  )
{
  protected override async Task PerformTypeSpecificValidation(UpsertLogBookEntryCommand command)
  {
    if (string.IsNullOrWhiteSpace(command.Notes))
    {
      throw CreateInvalidCommandException(command, $"\"{nameof(UpsertLogBookEntryCommand.Notes)}\" must be specified");
    }

    if (command.DateTime == null)
    {
      throw CreateInvalidCommandException(command, $"Missing {nameof(UpsertLogBookEntryCommand.DateTime)}");
    }

    DateTime entryDate = command.DateTime.Value.Date;

    if (await HasEntryForDay(command, entryDate))
    {
      throw CreateInvalidCommandException(
        command,
        $"An entry for this journal on {command.DateTime:yyyy-MM-dd} already exists."
      );
    }
  }

  private async Task<bool> HasEntryForDay(UpsertLogBookEntryCommand command, DateTime entryDate)
  {
    var entriesOnSameDay = await EntryRepository.GetEntriesForJournal(
      command.JournalId,
      entryDate,
      entryDate
    );

    return entriesOnSameDay.Any(e => e.DateTime?.Date == entryDate && e.Id != command.Id);
  }

  protected override void SetTypeSpecificValues(UpsertLogBookEntryCommand command, LogBookEntry entry)
  {
    // LogBook entries are date-only: strip the time component so that at most one entry can exist
    // per day, regardless of the time the client happens to send.
    entry.DateTime = DateTime.SpecifyKind(command.DateTime!.Value.Date, DateTimeKind.Utc);
  }
}
