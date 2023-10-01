using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.Counter;

public class UpsertCounterEntryCommandExecutor : BaseUpsertEntryCommandExecutor<
  UpsertCounterEntryCommand,
  CounterEntry,
  CounterJournal
>
{
  public UpsertCounterEntryCommandExecutor(UpsertCounterEntryCommand command) : base(command) { }

  protected override void SetTypeSpecificValues(IDateService dateService, CounterEntry entry) { }
}
