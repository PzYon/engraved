using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public class AddCounterMeasurementCommandExecutor : BaseAddMeasurementCommandExecutor<
  AddCounterMeasurementCommand,
  CounterMeasurement,
  CounterMetric
>
{
  public AddCounterMeasurementCommandExecutor(AddCounterMeasurementCommand command) : base(command) { }

  protected override CounterMeasurement CreateMeasurement(IDateService dateService)
  {
    return new CounterMeasurement();
  }
}
