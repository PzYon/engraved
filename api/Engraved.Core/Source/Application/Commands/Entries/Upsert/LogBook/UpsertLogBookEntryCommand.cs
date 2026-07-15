using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.LogBook;

public class UpsertLogBookEntryCommand : BaseUpsertScrapLikeEntryCommand
{
  public string? Title { get; set; }

  public override JournalType GetSupportedJournalType()
  {
    return JournalType.LogBook;
  }
}
