namespace Metrix.Core.Application.Commands.Measurements.Add;

public abstract class BaseAddMeasurementCommand : ICommand
{
  public string MetricKey { get; set; } = null!;

  public string? Notes { get; set; }

  public string? MetricFlagKey { get; set; }

  public abstract ICommandExecutor CreateExecutor();
}
