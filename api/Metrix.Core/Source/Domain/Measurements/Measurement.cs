namespace Metrix.Core.Domain.Measurements;

public class Measurement
{
  public string MetricKey { get; set; } = null!;

  public double Value { get; set; }

  public string? Notes { get; set; }

  public DateTime? DateTime { get; set; }
}
