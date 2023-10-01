using Engraved.Core.Domain.Journals;

namespace Engraved.Persistence.Mongo.DocumentTypes.Metrics;

public class ScrapsJournalDocument : JournalDocument
{
  public override JournalType Type => JournalType.Scraps;
}
