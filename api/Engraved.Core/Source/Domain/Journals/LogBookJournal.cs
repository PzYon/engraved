namespace Engraved.Core.Domain.Journals;

public class LogBookJournal : BaseJournal
{
  public override JournalType Type => JournalType.LogBook;
}
