using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.Counter;

public class UpsertCounterEntryCommandExecutor(
  IJournalRepository journalRepository,
  IEntryRepository entryRepository,
  IDateService dateService
)
  : BaseUpsertEntryCommandExecutor<
    UpsertCounterEntryCommand,
    CounterEntry,
    CounterJournal
  >(journalRepository, entryRepository, dateService)
{
  protected override void SetTypeSpecificValues(UpsertCounterEntryCommand command, CounterEntry entry) { }
}
