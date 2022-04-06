using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public class AddCounterMeasurementCommand : BaseAddMeasurementCommand
{
  public override MetricType GetSupportedMetricType()
  {
    return MetricType.Counter;
  }

  public override ICommandExecutor CreateExecutor()
  {
    return new AddCounterMeasurementCommandExecutor(this);
  }
}
