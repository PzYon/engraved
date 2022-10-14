using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Queries.Metrics.Get;

public class GetMetricQueryExecutor : IQueryExecutor<IMetric?>
{
  public bool DisableCache => false;
  
  private readonly GetMetricQuery _query;

  public GetMetricQueryExecutor(GetMetricQuery query)
  {
    _query = query;
  }

  public async Task<IMetric?> Execute(IRepository repository)
  {
    if (string.IsNullOrEmpty(_query.MetricId))
    {
      throw new InvalidQueryException<IMetric>(_query!, $"{nameof(_query.MetricId)} must be specified.");
    }

    IMetric? metric = await repository.GetMetric(_query.MetricId);
    if (metric == null)
    {
      return null;
    }

    IMetric[] metricWithEnsuredPermissions = await MetricQueryUtil.EnsurePermissionUsers(repository, metric);
    return metricWithEnsuredPermissions.First();
  }
}
