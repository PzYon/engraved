using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Queries.Activities.Get;

public class GetActivitiesQueryExecutor : IQueryExecutor<GetActivitiesQueryResult>
{
  public bool DisableCache => false;

  private readonly GetActivitiesQuery _query;

  public GetActivitiesQueryExecutor(GetActivitiesQuery query)
  {
    _query = query;
  }

  public async Task<GetActivitiesQueryResult> Execute(IRepository repository)
  {
    IMetric[] allMetrics = await repository.GetAllMetrics();
    string[] allMetricIds = allMetrics.Select(m => m.Id!).ToArray();

    IMeasurement[] allMeasurements = await repository.GetLastEditedMeasurements(
      allMetricIds,
      _query.SearchText,
      _query.Limit ?? 20
    );

    string[] relevantMetricIds = allMeasurements.Select(m => m.MetricId).ToArray();

    return new GetActivitiesQueryResult
    {
      Metrics = allMetrics.Where(m => relevantMetricIds.Contains(m.Id)).ToArray(),
      Measurements = allMeasurements.ToArray()
    };
  }
}
