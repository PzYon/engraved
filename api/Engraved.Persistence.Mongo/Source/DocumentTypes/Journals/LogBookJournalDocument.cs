using Engraved.Core.Domain.Journals;

namespace Engraved.Persistence.Mongo.DocumentTypes.Journals;

public class LogBookJournalDocument : JournalDocument
{
  public override JournalType Type => JournalType.LogBook;
}
