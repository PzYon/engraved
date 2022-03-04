using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Queries.Metrics.GetAll;

public class GetAllMetricsQuery : IQuery<GetAllMetricsQuery, Metric[]>
{
    IQueryExecutor<GetAllMetricsQuery, Metric[]> IQuery<GetAllMetricsQuery, Metric[]>.CreateExecutor() =>
        new GetAllMetricsQueryExecutor();
}