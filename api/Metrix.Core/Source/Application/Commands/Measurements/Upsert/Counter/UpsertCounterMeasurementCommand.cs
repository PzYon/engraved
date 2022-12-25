using Metrix.Core.Application.Commands.Measurements.Add;
using Metrix.Core.Application.Commands.Measurements.Add.Counter;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Upsert.Counter;

public class UpsertCounterMeasurementCommand : BaseUpsertMeasurementCommand
{
  public override MetricType GetSupportedMetricType()
  {
    return MetricType.Counter;
  }

  public override ICommandExecutor CreateExecutor()
  {
    return new UpsertCounterMeasurementCommandExecutor(this);
  }
}
