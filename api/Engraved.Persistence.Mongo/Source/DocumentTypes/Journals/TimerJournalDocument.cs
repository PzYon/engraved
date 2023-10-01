using Engraved.Core.Domain.Journals;

namespace Engraved.Persistence.Mongo.DocumentTypes.Metrics;

public class TimerJournalDocument : JournalDocument
{
  public override JournalType Type => JournalType.Timer;

  public DateTime? StartDate { get; set; }
}
