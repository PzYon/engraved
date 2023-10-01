using Engraved.Core.Domain.Journals;

namespace Engraved.Persistence.Mongo.DocumentTypes.Journals;

public class TimerJournalDocument : JournalDocument
{
  public override JournalType Type => JournalType.Timer;

  public DateTime? StartDate { get; set; }
}
