using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Queries.Metrics.Get;

public class GetMetricQuery : IQuery<IMetric?>
{
  public string? MetricId { get; set; }

  IQueryExecutor<IMetric?> IQuery<IMetric?>.CreateExecutor()
  {
    return new GetMetricQueryExecutor(this);
  }
}
