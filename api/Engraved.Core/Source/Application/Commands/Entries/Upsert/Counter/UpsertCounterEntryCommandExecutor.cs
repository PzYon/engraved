using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.Counter;

public class UpsertCounterEntryCommandExecutor(IRepository repository, IDateService dateService)
  : BaseUpsertEntryCommandExecutor<
    UpsertCounterEntryCommand,
    CounterEntry,
    CounterJournal
  >(repository, dateService)
{
  protected override void SetTypeSpecificValues(UpsertCounterEntryCommand command, CounterEntry entry) { }
}
