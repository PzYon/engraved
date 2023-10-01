namespace Engraved.Core.Domain.Journals;

public class CounterJournal : BaseJournal
{
  public override JournalType Type => JournalType.Counter;
}
