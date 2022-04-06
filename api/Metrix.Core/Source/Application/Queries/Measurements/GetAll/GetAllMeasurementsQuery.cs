using Metrix.Core.Domain.Measurements;

namespace Metrix.Core.Application.Queries.Measurements.GetAll;

public class GetAllMeasurementsQuery : IQuery<IMeasurement[]>
{
  public string? MetricKey { get; set; }

  IQueryExecutor<IMeasurement[]> IQuery<IMeasurement[]>.CreateExecutor()
  {
    return new GetAllMeasurementsQueryExecutor(this);
  }
}
