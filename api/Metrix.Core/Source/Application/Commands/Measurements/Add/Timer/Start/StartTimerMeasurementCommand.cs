using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add.Timer.Start;

public class StartTimerMeasurementCommand : BaseAddMeasurementCommand
{
  public override MetricType GetSupportedMetricType()
  {
    return MetricType.Timer;
  }

  public override ICommandExecutor CreateExecutor()
  {
    return new StartTimerMeasurementCommandExecutor(this);
  }
}