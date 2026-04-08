using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.LogBook;

public class UpsertLogBookEntryCommandExecutor(IRepository repository, IDateService dateService)
  : BaseUpsertEntryCommandExecutor<
    UpsertLogBookEntryCommand,
    LogBookEntry,
    LogBookJournal
  >(
    repository,
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
    var entriesOnSameDay = await Repository.GetEntriesForJournal(
      command.JournalId,
      entryDate,
      entryDate
    );

    return entriesOnSameDay.Any(e => e.Id != command.Id);
  }

  protected override void SetTypeSpecificValues(UpsertLogBookEntryCommand command, LogBookEntry entry) { }
}
