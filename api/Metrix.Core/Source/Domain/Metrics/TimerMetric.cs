namespace Metrix.Core.Domain.Metrics;

public class TimerMetric : BaseMetric
{
  public DateTime? StartDateTime { get; set; } = null;

  public TimerMetric()
  {
    Type = MetricType.Timer;
  }
}
