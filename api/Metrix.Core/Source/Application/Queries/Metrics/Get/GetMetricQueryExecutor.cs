using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Queries.Metrics.Get;

public class GetMetricQueryExecutor : IQueryExecutor<IMetric>
{
  private readonly GetMetricQuery _query;

  public GetMetricQueryExecutor(GetMetricQuery query)
  {
    _query = query;
  }

  public Task<IMetric> Execute(IDb db)
  {
    return db.GetMetric(_query.MetricKey);
  }
}
