using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.LogBook;

public class UpsertLogBookEntryCommand : BaseUpsertScrapLikeEntryCommand
{
  public override JournalType GetSupportedJournalType()
  {
    return JournalType.LogBook;
  }
}
