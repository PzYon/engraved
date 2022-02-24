using Metrix.Core.Domain.Measurements;

namespace Metrix.Core.Application.Queries.Measurements.GetAll;

public class GetAllMeasurementsQuery : IQuery<GetAllMeasurementsQuery, Measurement[]>
{
  public string MetricKey { get; set; }

  public IQueryExecutor<GetAllMeasurementsQuery, Measurement[]> CreateExecutor() =>
    new GetAllMeasurementsQueryExecutor();
}
