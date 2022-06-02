namespace Metrix.Core.Domain.Measurements;

public abstract class BaseMeasurement : IMeasurement
{
  public string? Id { get; set; }

  public string? UserId { get; set; }

  public string MetricId { get; set; } = null!;

  public string? Notes { get; set; }

  public DateTime? DateTime { get; set; }

  public Dictionary<string, string[]> MetricAttributeValues { get; set; } = new();
}
