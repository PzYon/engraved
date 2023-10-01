using Engraved.Core.Domain.Journals;

namespace Engraved.Persistence.Mongo.DocumentTypes.Metrics;

public class GaugeJournalDocument : JournalDocument
{
  public override JournalType Type => JournalType.Gauge;
}
