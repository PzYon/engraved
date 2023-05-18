using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Queries.Metrics.GetAll;

public class GetAllMetricsQueryExecutor : IQueryExecutor<IMetric[]>
{
  private readonly GetAllMetricsQuery _query;

  public GetAllMetricsQueryExecutor(GetAllMetricsQuery query)
  {
    _query = query;
  }

  public bool DisableCache => false;

  public async Task<IMetric[]> Execute(IRepository repository)
  {
    IMetric[] allMetrics = await repository.GetAllMetrics(_query.SearchText, _query.Limit);

    return await MetricQueryUtil.EnsurePermissionUsers(repository, allMetrics);
  }
}
