using Engraved.Core.Application.Commands.Entries.AddSchedule;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.LogBook;

public class UpsertLogBookEntryCommand : BaseUpsertEntryCommand
{
  public string Title { get; set; } = null!;
  
  public AddScheduleToEntryCommand? Schedule { get; set; }

  public override JournalType GetSupportedJournalType()
  {
    return JournalType.LogBook;
  }
}
