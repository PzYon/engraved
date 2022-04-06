using Metrix.Core.Domain.Measurements;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public class AddTimerMeasurementCommandExecutor : BaseAddMeasurementCommandExecutor<
  AddTimerMeasurementCommand,
  TimerMeasurement
>
{
  public AddTimerMeasurementCommandExecutor(AddTimerMeasurementCommand command) : base(command) { }

  protected override TimerMeasurement CreateMeasurement()
  {
    return new TimerMeasurement();
  }
}
