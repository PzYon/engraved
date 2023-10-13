using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.Timer;

public class UpsertTimerEntryCommand : BaseUpsertEntryCommand
{
  public DateTime? StartDate { get; set; }

  public DateTime? EndDate { get; set; }

  public override JournalType GetSupportedJournalType()
  {
    return JournalType.Timer;
  }
}
