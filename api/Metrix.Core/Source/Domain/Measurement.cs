namespace Metrix.Core.Domain;

public class Measurement
{
  public Metric Metric { get; set; }

  public long Value { get; set; }

  public string Notes { get; set; }

  public DateTime DateTime { get; set; }
}
