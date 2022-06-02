namespace Metrix.Core.Domain.Metrics;

public class MetricAttribute
{
  public string Name { get; set; } = null!;

  public Dictionary<string, string> Values { get; set; } = new();
}
