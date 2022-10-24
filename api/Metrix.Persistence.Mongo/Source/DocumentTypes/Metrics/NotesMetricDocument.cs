using Metrix.Core.Domain.Metrics;

namespace Metrix.Persistence.Mongo.DocumentTypes.Metrics;

public class NotesMetricDocument : MetricDocument
{
  public override MetricType Type => MetricType.Notes;
}
