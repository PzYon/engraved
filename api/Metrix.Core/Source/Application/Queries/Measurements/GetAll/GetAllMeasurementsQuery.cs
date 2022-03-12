using Metrix.Core.Domain.Measurements;

namespace Metrix.Core.Application.Queries.Measurements.GetAll;

public class GetAllMeasurementsQuery : IQuery<Measurement[]>
{
  public string? MetricKey { get; set; }

  IQueryExecutor<Measurement[]> IQuery<Measurement[]>.CreateExecutor()
  {
    return new GetAllMeasurementsQueryExecutor(this);
  }
}
