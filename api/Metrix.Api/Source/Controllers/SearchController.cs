using Metrix.Core.Application;
using Metrix.Core.Application.Queries.Measurements.GetAll;
using Metrix.Core.Application.Search;
using Metrix.Core.Domain.Measurements;
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
    IMeasurement[] measurements = await _dispatcher.Query(new GetAllMeasurementsQuery { MetricId = metricId });
    return _searchIndex.Search(searchText, measurements.Select(s => s.MetricAttributeValues).ToArray());
  }
}
