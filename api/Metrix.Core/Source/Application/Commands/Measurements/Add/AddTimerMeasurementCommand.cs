namespace Metrix.Core.Application.Commands.Measurements.Add;

public class AddTimerMeasurementCommand : BaseAddMeasurementCommand
{
  public override ICommandExecutor CreateExecutor()
  {
    return new AddTimerMeasurementCommandExecutor(this);
  }
}
