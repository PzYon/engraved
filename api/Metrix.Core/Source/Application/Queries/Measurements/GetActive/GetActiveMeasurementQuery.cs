using Metrix.Core.Domain.Measurements;

namespace Metrix.Core.Application.Queries.Measurements.GetActive;

public class GetActiveMeasurementQuery : IQuery<IMeasurement?>
{
  public string? MetricId { get; set; }

  IQueryExecutor<IMeasurement?> IQuery<IMeasurement?>.CreateExecutor()
  {
    return new GetActiveMeasurementQueryExecutor(this);
  }
}
