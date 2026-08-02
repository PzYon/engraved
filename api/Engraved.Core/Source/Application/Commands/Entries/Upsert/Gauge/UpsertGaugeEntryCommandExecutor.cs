using Engraved.Core.Application.Files;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.Gauge;

public class UpsertGaugeEntryCommandExecutor(
  IJournalRepository journalRepository,
  IEntryRepository entryRepository,
  IDateService dateService,
  FileAcceptor fileAcceptor
)
  : BaseUpsertEntryCommandExecutor<
    UpsertGaugeEntryCommand,
    GaugeEntry,
    GaugeJournal
  >(journalRepository, entryRepository, dateService, fileAcceptor)
{
  protected override Task PerformTypeSpecificValidation(UpsertGaugeEntryCommand command)
  {
    if (command.Value == null)
    {
      throw CreateInvalidCommandException(command, $"\"{nameof(UpsertGaugeEntryCommand.Value)}\" must be specified");
    }

    return Task.CompletedTask;
  }

  protected override void SetTypeSpecificValues(UpsertGaugeEntryCommand command, GaugeEntry entry)
  {
    entry.Value = command.Value!.Value;
  }
}
