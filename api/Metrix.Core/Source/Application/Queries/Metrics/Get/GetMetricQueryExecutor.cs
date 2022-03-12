using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Queries.Metrics.Get;

public class GetMetricQueryExecutor : IQueryExecutor<Metric>
{
  private readonly GetMetricQuery _query;

  public GetMetricQueryExecutor(GetMetricQuery query)
  {
    _query = query;
  }

  public Metric Execute(IDb db)
  {
    return db.Metrics.FirstOrDefault(m => m.Key == _query.MetricKey)!;
  }
}
