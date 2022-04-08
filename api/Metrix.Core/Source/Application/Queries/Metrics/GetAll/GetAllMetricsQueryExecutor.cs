using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Queries.Metrics.GetAll;

public class GetAllMetricsQueryExecutor : IQueryExecutor<IMetric[]>
{
  private readonly GetAllMetricsQuery _command;

  public GetAllMetricsQueryExecutor(GetAllMetricsQuery command)
  {
    _command = command;
  }

  public IMetric[] Execute(IDb db)
  {
    return db.Metrics.ToArray();
  }
}
