using Metrix.Core.Application;
using Metrix.Core.Application.Queries.Measurements.GetAll;
using Metrix.Core.Application.Queries.Metrics.Get;
using Metrix.Core.Application.Search;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

[ApiController]
[Route("api/search")]
[Authorize]
public class SearchController : ControllerBase
{
  private readonly Dispatcher _dispatcher;
  private readonly ISearchIndex _searchIndex;

  public SearchController(Dispatcher dispatcher, ISearchIndex searchIndex)
  {
    _dispatcher = dispatcher;
    _searchIndex = searchIndex;
  }

  [Route("metric_attributes/{metricId}")]
  [HttpGet]
  public async Task<List<SearchResult>> GetAll(string metricId, string searchText)
  {
    IMetric? metric = await _dispatcher.Query(new GetMetricQuery { MetricId = metricId });
    if (metric == null)
    {
      throw new Exception("Metric not found.");
    }

    IMeasurement[] measurements = await _dispatcher.Query(new GetAllMeasurementsQuery { MetricId = metricId });

    return _searchIndex.Search(
      searchText,
      metric.Attributes,
      measurements.Select(s => s.MetricAttributeValues).ToArray()
    );
  }
}
