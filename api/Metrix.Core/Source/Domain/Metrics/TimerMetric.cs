namespace Metrix.Core.Domain.Metrics;

public class TimerMetric : BaseMetric
{
  public DateTime? StartDate { get; set; }

  public TimerMetric()
  {
    Type = MetricType.Timer;
  }
}
