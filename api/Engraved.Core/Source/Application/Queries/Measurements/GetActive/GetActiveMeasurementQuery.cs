using Engraved.Core.Domain.Measurements;

namespace Engraved.Core.Application.Queries.Measurements.GetActive;

public class GetActiveMeasurementQuery : IQuery<IMeasurement?>
{
  public string? MetricId { get; set; }

  IQueryExecutor<IMeasurement?> IQuery<IMeasurement?>.CreateExecutor()
  {
    return new GetActiveMeasurementQueryExecutor(this);
  }
}
