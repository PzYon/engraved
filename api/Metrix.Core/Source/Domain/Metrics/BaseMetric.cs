namespace Metrix.Core.Domain.Metrics;

public abstract class BaseMetric : IMetric
{
  public string Key { get; set; } = null!;

  public string Name { get; set; } = null!;

  public string? Description { get; set; }

  public MetricType Type { get; protected set; }

  public Dictionary<string, string> Flags { get; set; } = new();
}
