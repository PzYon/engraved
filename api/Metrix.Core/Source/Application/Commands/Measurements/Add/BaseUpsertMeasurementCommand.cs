using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public abstract class BaseUpsertMeasurementCommand : ICommand
{
  public string MetricKey { get; set; } = null!;

  public string? Notes { get; set; }

  public string? MetricFlagKey { get; set; }

  public abstract MetricType GetSupportedMetricType();

  public abstract ICommandExecutor CreateExecutor();
}
