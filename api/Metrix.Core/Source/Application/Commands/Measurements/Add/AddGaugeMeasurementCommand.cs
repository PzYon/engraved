namespace Metrix.Core.Application.Commands.Measurements.Add;

public class AddGaugeMeasurementCommand : BaseAddMeasurementCommand
{
  public double Value { get; set; }

  public override ICommandExecutor CreateExecutor()
  {
    return new AddGaugeMeasurementCommandExecutor(this);
  }
}
