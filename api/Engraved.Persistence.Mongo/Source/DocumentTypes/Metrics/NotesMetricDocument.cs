using Engraved.Core.Domain.Metrics;

namespace Engraved.Persistence.Mongo.DocumentTypes.Metrics;

public class NotesMetricDocument : MetricDocument
{
  public override MetricType Type => MetricType.Notes;
}
