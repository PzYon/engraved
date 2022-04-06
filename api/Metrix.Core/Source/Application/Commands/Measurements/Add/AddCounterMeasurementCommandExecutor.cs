using Metrix.Core.Domain.Measurements;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public class AddCounterMeasurementCommandExecutor : BaseAddMeasurementCommandExecutor<AddCounterMeasurementCommand>
{
  public AddCounterMeasurementCommandExecutor(AddCounterMeasurementCommand command) : base(command) { }

  protected override IMeasurement CreateMeasurement()
  {
    return new CounterMeasurement();
  }
}
