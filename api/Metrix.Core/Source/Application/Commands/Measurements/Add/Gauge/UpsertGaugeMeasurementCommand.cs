using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add.Gauge;

public class UpsertGaugeMeasurementCommand : BaseUpsertMeasurementCommand
{
  public double? Value { get; set; }

  public override MetricType GetSupportedMetricType()
  {
    return MetricType.Gauge;
  }

  public override ICommandExecutor CreateExecutor()
  {
    return new UpsertGaugeMeasurementCommandExecutor(this);
  }
}
