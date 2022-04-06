namespace Metrix.Core.Domain.Measurements;

public abstract class BaseMeasurement : IMeasurement
{
  public string MetricKey { get; set; }

  public string? Notes { get; set; }

  public DateTime? DateTime { get; set; }

  public string? MetricFlagKey { get; set; }
}
