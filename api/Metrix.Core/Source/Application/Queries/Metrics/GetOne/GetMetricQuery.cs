using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Queries.Metrics.GetOne;

public class GetMetricQuery : IQuery<GetMetricQuery, Metric>
{
  public string MetricKey { get; set; }

  public IQueryExecutor<GetMetricQuery, Metric> CreateExecutor() => new GetMetricQueryExecutor();
}
