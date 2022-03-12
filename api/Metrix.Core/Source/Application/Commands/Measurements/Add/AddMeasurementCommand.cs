namespace Metrix.Core.Application.Commands.Measurements.Add;

public class AddMeasurementCommand : ICommand
{
  public string MetricKey { get; set; } = null!;

  public double? Value { get; set; }

  public string? Notes { get; set; }

  public ICommandExecutor CreateExecutor()
  {
    return new AddMeasurementCommandExecutor(this);
  }
}
