namespace Engraved.Core.Domain.Journals;

public class LogBookJournal : BaseJournal
{
  public string? Template { get; set; }

  public override JournalType Type => JournalType.LogBook;
}
