namespace Engraved.Core.Domain.Journals;

public class GaugeJournal : BaseJournal
{
  public override JournalType Type => JournalType.Gauge;
}
