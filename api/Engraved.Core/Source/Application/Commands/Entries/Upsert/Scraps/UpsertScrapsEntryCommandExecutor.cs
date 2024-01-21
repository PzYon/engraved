using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.Scraps;

public class UpsertScrapsEntryCommandExecutor : BaseUpsertEntryCommandExecutor<
  UpsertScrapsEntryCommand,
  ScrapsEntry,
  ScrapsJournal
>
{
  public UpsertScrapsEntryCommandExecutor(IRepository repository, IDateService dateService) : base(
    repository,
    dateService
  ) { }

  protected override Task PerformTypeSpecificValidation(UpsertScrapsEntryCommand command)
  {
    if (string.IsNullOrWhiteSpace(command.Title) && string.IsNullOrWhiteSpace(command.Notes))
    {
      throw CreateInvalidCommandException(
        command,
        $"Either \"{nameof(UpsertScrapsEntryCommand.Title)}\" or \"{nameof(UpsertScrapsEntryCommand.Notes)}\" must be specified"
      );
    }

    return Task.CompletedTask;
  }

  protected override void SetTypeSpecificValues(UpsertScrapsEntryCommand command, ScrapsEntry entry)
  {
    entry.Title = command.Title;
    entry.ScrapType = command.ScrapType;
  }
}
