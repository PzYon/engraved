using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;

namespace Metrix.Core.Application.Queries.Measurements.GetAll;

public class GetAllMeasurementsQueryExecutor : IQueryExecutor<GetAllMeasurementsQuery, Measurement[]>
{
  public Measurement[] Execute(IDb db, GetAllMeasurementsQuery query)
  {
    return db.Measurements.Where(m => m.MetricKey == query.MetricKey).ToArray();
  }
}
