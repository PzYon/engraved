using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Queries.Metrics.Get;

public class GetMetricQueryExecutor : IQueryExecutor<GetMetricQuery, Metric>
{
  public Metric? Execute(IDb db, GetMetricQuery query)
  {
    return db.Metrics.FirstOrDefault(m => m.Key == query.MetricKey);
  }
}
