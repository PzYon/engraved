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
  protected override Task PerformTypeSpecificValidation(UpsertLogBookEntryCommand command)
  {
    if (string.IsNullOrWhiteSpace(command.Title) && string.IsNullOrWhiteSpace(command.Notes))
    {
      throw CreateInvalidCommandException(
        command,
        $"Either \"{nameof(UpsertLogBookEntryCommand.Title)}\" or \"{nameof(UpsertLogBookEntryCommand.Notes)}\" must be specified"
      );
    }

    return Task.CompletedTask;
  }

  protected override void SetTypeSpecificValues(UpsertLogBookEntryCommand command, LogBookEntry entry) { }
}
