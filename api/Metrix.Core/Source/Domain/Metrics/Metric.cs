namespace Metrix.Core.Domain.Metrics;

public class Metric
{
  public string Key { get; set; } = null!;

  public string Name { get; set; } = null!;

  public string? Description { get; set; }

  public MetricType Type { get; set; }
}
