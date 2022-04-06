namespace Metrix.Core.Application.Commands.Measurements.Add;

public class EndTimerMeasurementCommand : ICommand
{
  public string MetricKey { get; set; } = null!;

  // what about Notes?
  
  public ICommandExecutor CreateExecutor()
  {
    return new EndTimerMeasurementCommandExecutor(this);
  }
}
