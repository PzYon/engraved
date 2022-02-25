using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Queries.Metrics.Get;

public class GetMetricQuery : IQuery<GetMetricQuery, Metric>
{
    public string MetricKey { get; set; }

    IQueryExecutor<GetMetricQuery, Metric> IQuery<GetMetricQuery, Metric>.CreateExecutor() =>
        new GetMetricQueryExecutor();
}