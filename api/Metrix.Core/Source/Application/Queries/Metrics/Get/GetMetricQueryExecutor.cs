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

  public async Task<IMetric> Execute(IDb db)
  {
    if (string.IsNullOrEmpty(_query.MetricKey))
    {
      throw new InvalidQueryException<IMetric>(_query, $"{nameof(_query.MetricKey)} must be specified.");
    }

    IMetric metric = (await db.GetMetric(_query.MetricKey))!;

    return metric;
  }
}
