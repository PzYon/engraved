using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public abstract class BaseUpsertMeasurementCommand : ICommand
{
  public string? Id { get; set; }

  public string MetricId { get; set; } = null!;

  public string? Notes { get; set; }

  public Dictionary<string, string[]> MetricFlagKeys { get; set; } = new();

  public abstract ICommandExecutor CreateExecutor();

  public abstract MetricType GetSupportedMetricType();
}
