using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Queries.Metrics.GetAll;

public class GetAllMetricsQueryExecutor : IQueryExecutor<GetAllMetricsQuery, Metric[]>
{
  public Metric?[] Execute(IDb db, GetAllMetricsQuery query)
  {
    return db.Metrics.ToArray();
  }
}
