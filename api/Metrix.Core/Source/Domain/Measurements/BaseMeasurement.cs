namespace Metrix.Core.Domain.Measurements;

public abstract class BaseMeasurement : IMeasurement
{
  public string? Id { get; set; }

  public string MetricId { get; set; } = null!;

  public string? Notes { get; set; }

  public DateTime? DateTime { get; set; }

  public string? MetricFlagKey { get; set; }
}
