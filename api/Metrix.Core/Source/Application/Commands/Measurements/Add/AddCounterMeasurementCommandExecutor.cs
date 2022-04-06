using Metrix.Core.Domain.Measurements;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public class AddCounterMeasurementCommandExecutor : BaseAddMeasurementCommandExecutor<
  AddCounterMeasurementCommand,
  CounterMeasurement>
{
  public AddCounterMeasurementCommandExecutor(AddCounterMeasurementCommand command) : base(command) { }

  protected override CounterMeasurement CreateMeasurement()
  {
    return new CounterMeasurement();
  }
}
