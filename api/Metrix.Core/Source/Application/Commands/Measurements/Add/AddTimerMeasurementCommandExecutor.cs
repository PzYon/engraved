using Metrix.Core.Domain.Measurements;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public class AddTimerMeasurementCommandExecutor : BaseAddMeasurementCommandExecutor<AddTimerMeasurementCommand>
{
  public AddTimerMeasurementCommandExecutor(AddTimerMeasurementCommand command) : base(command) { }

  protected override IMeasurement CreateMeasurement()
  {
    return new TimerMeasurement();
  }
}
