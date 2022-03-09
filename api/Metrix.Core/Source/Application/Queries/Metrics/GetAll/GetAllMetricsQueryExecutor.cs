using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Queries.Metrics.GetAll;

public class GetAllMetricsQueryExecutor : IQueryExecutor<Metric[]>
{
  private readonly GetAllMetricsQuery _command;

  public GetAllMetricsQueryExecutor(GetAllMetricsQuery command)
  {
    _command = command;
  }

  public Metric?[] Execute(IDb db)
  {
    return db.Metrics.ToArray();
  }
}
