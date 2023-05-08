using Engraved.Core.Application;
using Engraved.Core.Application.Queries.Search.Attributes;
using Engraved.Core.Application.Queries.Search.Measurements;
using Engraved.Core.Application.Search;
using Engraved.Core.Domain.Measurements;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

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

  [Route("measurements")]
  [HttpGet]
  public async Task<object[]> SearchMeasurements(string searchText)
  {
    var query = new SearchMeasurementsQuery { SearchText = searchText };
    IMeasurement[] measurements = await _dispatcher.Query(query);
    
    return measurements.EnsurePolymorphismWhenSerializing();
  }

  [Route("metric_attributes/{metricId}")]
  [HttpGet]
  public async Task<AttributeSearchResult[]> SearchMetricAttributes(string metricId, string searchText)
  {
    var searchAttributesQuery = new SearchAttributesQuery
    {
      MetricId = metricId,
      SearchText = searchText
    };

    // it's not good that we inject dependencies here like this,
    // but for the moment it's the easiest. i guess the best solution
    // would be to have the actions be created by the framework's DI.
    searchAttributesQuery.SetSearchIndex(_searchIndex);
    searchAttributesQuery.SetDispatcher(_dispatcher);

    return await _dispatcher.Query(searchAttributesQuery);
  }
}
