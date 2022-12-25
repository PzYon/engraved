using Metrix.Core.Application.Commands.Measurements.Add;
using Metrix.Core.Application.Commands.Measurements.Add.Timer.Upsert;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Upsert.Timer;

public class UpsertTimerMeasurementCommand : BaseUpsertMeasurementCommand
{
  public DateTime StartDate { get; set; }

  public DateTime? EndDate { get; set; }
  
  public override ICommandExecutor CreateExecutor()
  {
    return new UpsertTimerMeasurementCommandExecutor(this);
  }

  public override MetricType GetSupportedMetricType()
  {
    return MetricType.Timer;
  }
}
