namespace Metrix.Core.Domain.Metrics;

public class TimerMetric : BaseMetric
{
  public override MetricType Type => MetricType.Timer;

  public DateTime? StartDate { get; set; }
}
