using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Queries.Metrics.GetAll;

public class GetAllMetricsQueryExecutor : IQueryExecutor<IMetric[]>
{
  public bool DisableCache => false;

  public async Task<IMetric[]> Execute(IRepository repository)
  {
    IMetric[] allMetrics = await repository.GetAllMetrics();

    return await MetricQueryUtil.EnsurePermissionUsers(repository, allMetrics);
  }
}
