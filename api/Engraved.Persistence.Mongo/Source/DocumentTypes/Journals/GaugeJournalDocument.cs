using Engraved.Core.Domain.Journals;

namespace Engraved.Persistence.Mongo.DocumentTypes.Journals;

public class GaugeJournalDocument : JournalDocument
{
  public override JournalType Type => JournalType.Gauge;
}
