using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Queries.Metrics.GetAll;

public class GetAllMetricsQuery : IQuery<IMetric[]>
{
  public int? Limit { get; set; }

  public string? SearchText { get; set; }
  
  IQueryExecutor<IMetric[]> IQuery<IMetric[]>.CreateExecutor()
  {
    return new GetAllMetricsQueryExecutor(this);
  }
}
