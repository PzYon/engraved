using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries.Measurements.GetAll;
using Engraved.Core.Application.Queries.Metrics.Get;
using Engraved.Core.Application.Search;
using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Queries.Search;

public class SearchAttributesQueryExecutor : IQueryExecutor<AttributeSearchResult[]>
{
  private readonly SearchAttributesQuery _query;

  public bool DisableCache => true;

  public SearchAttributesQueryExecutor(SearchAttributesQuery query)
  {
    _query = query;
  }

  public async Task<AttributeSearchResult[]> Execute(IRepository repository)
  {
    var metricQuery = new GetMetricQuery { MetricId = _query.MetricId };
    IMetric? metric = await _query.GetDispatcher().Query(metricQuery);

    if (metric == null)
    {
      throw new Exception("Metric not found.");
    }

    var measurementsQuery = new GetAllMeasurementsQuery { MetricId = _query.MetricId };
    IMeasurement[] measurements = await _query.GetDispatcher().Query(measurementsQuery);

    return _query
      .GetSearchIndex()
      .Search(
        _query.SearchText,
        metric.Attributes,
        measurements.Select(s => s.MetricAttributeValues).ToArray()
      );
  }
}
