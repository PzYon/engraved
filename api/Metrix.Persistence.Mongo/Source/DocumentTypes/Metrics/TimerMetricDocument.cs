namespace Metrix.Persistence.Mongo.DocumentTypes.Metrics;

public class TimerMetricDocument : BaseMetricDocument
{
  public DateTime? StartDate { get; set; }
}
