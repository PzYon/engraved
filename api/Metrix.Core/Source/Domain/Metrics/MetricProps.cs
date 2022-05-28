namespace Metrix.Core.Domain.Metrics;

public class MetricProps
{
  public string Name { get; set; }

  public Dictionary<string, string> Values { get; set; } = new();
}
