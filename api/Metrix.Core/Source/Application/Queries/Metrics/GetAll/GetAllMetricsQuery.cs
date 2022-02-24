using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Queries.Metrics.GetAll;

public class GetAllMetricsQuery : IQuery<GetAllMetricsQuery, Metric[]>
{
  public IQueryExecutor<GetAllMetricsQuery, Metric[]> CreateExecutor() => new GetAllMetricsQueryExecutor();
}
