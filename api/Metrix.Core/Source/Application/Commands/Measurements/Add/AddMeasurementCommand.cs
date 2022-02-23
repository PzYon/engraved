namespace Metrix.Core.Application.Commands.Measurements.Add;

public class AddMeasurementCommand : ICommand<AddMeasurementCommand>
{
  public string? MetricKey { get; set; }
  
  public string? Notes { get; set; }

  public ICommandExecutor<AddMeasurementCommand> CreateExecutor()
  {
    return new AddMeasurementCommandExecutor();
  }
}
