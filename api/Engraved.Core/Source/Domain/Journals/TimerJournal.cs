namespace Engraved.Core.Domain.Journals;

public class TimerJournal : BaseJournal
{
  public override JournalType Type => JournalType.Timer;

  public DateTime? StartDate { get; set; }
}
