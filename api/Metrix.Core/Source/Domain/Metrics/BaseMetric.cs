using Metrix.Core.Domain.Permissions;

namespace Metrix.Core.Domain.Metrics;

public abstract class BaseMetric : IMetric
{
  public string? Id { get; set; }

  public string? UserId { get; set; }

  public string Name { get; set; } = null!;

  public string? Description { get; set; }

  public string? Notes { get; set; }

  public abstract MetricType Type { get; }

  public Dictionary<string, MetricAttribute> Attributes { get; set; } = new();

  public Dictionary<string, Dictionary<string, double>> Thresholds { get; set; } = new();

  public DateTime? EditedOn { get; set; }

  public Dictionary<string, string> CustomProps { get; set; } = new();

  public UserPermissions Permissions { get; set; } = new();
}
