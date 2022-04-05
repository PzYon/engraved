using Metrix.Core.Domain.Measurements;

namespace Metrix.Core.Application.Queries.Measurements.GetAll;

public class GetAllMeasurementsQuery : IQuery<BaseMeasurement[]>
{
  public string? MetricKey { get; set; }

  IQueryExecutor<BaseMeasurement[]> IQuery<BaseMeasurement[]>.CreateExecutor()
  {
    return new GetAllMeasurementsQueryExecutor(this);
  }
}
