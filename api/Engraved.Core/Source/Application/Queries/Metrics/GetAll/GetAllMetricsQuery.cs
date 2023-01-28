using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Queries.Metrics.GetAll;

public class GetAllMetricsQuery : IQuery<IMetric[]>
{
  IQueryExecutor<IMetric[]> IQuery<IMetric[]>.CreateExecutor()
  {
    return new GetAllMetricsQueryExecutor();
  }
}
