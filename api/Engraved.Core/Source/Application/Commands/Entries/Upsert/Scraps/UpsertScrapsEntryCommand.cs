using Engraved.Core.Application.Commands.Entries.AddSchedule;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.Scraps;

public class UpsertScrapsEntryCommand : BaseUpsertEntryCommand
{
  public string Title { get; set; } = null!;

  public ScrapType ScrapType { get; set; } = ScrapType.Markdown;

  public AddScheduleToEntryCommand? Schedule { get; set; }
  
  public override JournalType GetSupportedJournalType()
  {
    return JournalType.Scraps;
  }
}
