using Engraved.Core.Application.Files;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.Counter;

public class UpsertCounterEntryCommandExecutor(
  IJournalRepository journalRepository,
  IEntryRepository entryRepository,
  IDateService dateService,
  FileAcceptor fileAcceptor
)
  : BaseUpsertEntryCommandExecutor<
    UpsertCounterEntryCommand,
    CounterEntry,
    CounterJournal
  >(journalRepository, entryRepository, dateService, fileAcceptor)
{
  protected override void SetTypeSpecificValues(UpsertCounterEntryCommand command, CounterEntry entry) { }
}
