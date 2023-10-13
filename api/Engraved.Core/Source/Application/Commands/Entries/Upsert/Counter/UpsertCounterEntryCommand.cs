using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.Counter;

public class UpsertCounterEntryCommand : BaseUpsertEntryCommand
{
  public override JournalType GetSupportedJournalType()
  {
    return JournalType.Counter;
  }
}
