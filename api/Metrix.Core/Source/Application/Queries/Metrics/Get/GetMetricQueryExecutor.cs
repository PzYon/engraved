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

  public IMetric Execute(IDb db)
  {
    return db.Metrics.FirstOrDefault(m => m.Key == _query.MetricKey)!;
  }
}
