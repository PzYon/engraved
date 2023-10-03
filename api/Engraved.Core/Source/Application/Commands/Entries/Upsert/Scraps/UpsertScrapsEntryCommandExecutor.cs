using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.Scraps;

public class UpsertScrapsEntryCommandExecutor : BaseUpsertEntryCommandExecutor<
  UpsertScrapsEntryCommand,
  ScrapsEntry,
  ScrapsJournal
>
{
  public UpsertScrapsEntryCommandExecutor(UpsertScrapsEntryCommand command) : base(command) { }

  protected override Task PerformTypeSpecificValidation()
  {
    if (string.IsNullOrWhiteSpace(Command.Notes))
    {
      throw CreateInvalidCommandException($"\"{nameof(UpsertScrapsEntryCommand.Notes)}\" must be specified");
    }

    return Task.CompletedTask;
  }

  protected override void SetTypeSpecificValues(IDateService dateService, ScrapsEntry entry)
  {
    entry.Title = Command.Title;
    entry.ScrapType = Command.ScrapType;
  }
}
