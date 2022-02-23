namespace Metrix.Core.Domain.Metrics;

public class Metric
{
  public string Key { get; set; }

  public string Name { get; set; }

  public string Description { get; set; }

  public MetricType Type { get; set; }

  public string Unit { get; set; }
}
