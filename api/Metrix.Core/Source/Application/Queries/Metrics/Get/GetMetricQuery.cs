using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Queries.Metrics.Get;

public class GetMetricQuery : IQuery<Metric>
{
  public string MetricKey { get; set; }

  IQueryExecutor<Metric> IQuery<Metric>.CreateExecutor() => new GetMetricQueryExecutor(this);
}
