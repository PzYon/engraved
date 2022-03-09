using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Queries.Metrics.GetAll;

public class GetAllMetricsQuery : IQuery<Metric[]>
{
  IQueryExecutor<Metric[]> IQuery<Metric[]>.CreateExecutor() => new GetAllMetricsQueryExecutor(this);
}
