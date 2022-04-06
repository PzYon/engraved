namespace Metrix.Core.Application.Commands.Measurements.Add;

public class AddCounterMeasurementCommand : BaseAddMeasurementCommand
{
  public override ICommandExecutor CreateExecutor()
  {
    return new AddCounterMeasurementCommandExecutor(this);
  }
}
