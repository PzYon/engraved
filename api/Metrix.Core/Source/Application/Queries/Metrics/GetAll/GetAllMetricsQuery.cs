using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Queries.Metrics.GetAll;

public class GetAllMetricsQuery : IQuery<IMetric[]>
{
  IQueryExecutor<IMetric[]> IQuery<IMetric[]>.CreateExecutor()
  {
    return new GetAllMetricsQueryExecutor(this);
  }
}
