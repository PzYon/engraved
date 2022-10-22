using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Queries.Metrics.GetAll;

public class GetAllMetricsQueryExecutor : IQueryExecutor<IMetric[]>
{
  public bool DisableCache => false;

  public async Task<IMetric[]> Execute(IRepository repository)
  {
    IMetric[] allMetrics = await repository.GetAllMetrics();

    allMetrics = await MetricQueryUtil.EnsurePermissionUsers(repository, allMetrics);

    return allMetrics.OrderByDescending(m => m.EditedOn).ToArray();
  }
}
