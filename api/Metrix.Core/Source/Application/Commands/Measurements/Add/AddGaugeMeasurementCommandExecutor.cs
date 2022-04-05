using Metrix.Core.Domain.Measurements;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public class AddGaugeMeasurementCommandExecutor : BaseAddMeasurementCommandExecutor<AddGaugeMeasurementCommand>
{
  public AddGaugeMeasurementCommandExecutor(AddGaugeMeasurementCommand command) : base(command) { }

  protected override BaseMeasurement CreateMeasurement()
  {
    return new GaugeMeasurement
    {
      Value = Command.Value
    };
  }
}
