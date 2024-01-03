using Engraved.Core.Application;
using Engraved.Core.Application.Queries.Search.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/search")]
[Authorize]
public class SearchController(Dispatcher dispatcher) : ControllerBase
{
  [Route("entities")]
  [HttpGet]
  public async Task<dynamic> SearchEntities(string searchText)
  {
    var query = new SearchEntitiesQuery
    {
      SearchText = searchText,
      Limit = 100
    };

    SearchEntitiesResult result = await dispatcher.Query<SearchEntitiesResult, SearchEntitiesQuery>(query);

    return new SearchEntitiesResultWeb
    {
      Entities = result.Entities.Select(e => SearchEntitiesResultWeb.X(e)).ToArray(),
      Journals = result.Journals.EnsurePolymorphismWhenSerializing()
    };
  }
}

// we need this stuff to ensure polymorphism during serialization
public class SearchResultEntityWeb
{
  public dynamic Entity { get; set; } = null!;

  public EntityType EntityType { get; set; }
}

public class SearchEntitiesResultWeb
{
  public SearchResultEntityWeb[] Entities { get; set; } = Array.Empty<SearchResultEntityWeb>();

  public dynamic[] Journals { get; set; } = Array.Empty<dynamic>();

  public static SearchResultEntityWeb X(SearchResultEntity e)
  {
    return new SearchResultEntityWeb
    {
      Entity = e.Entity,
      EntityType = e.EntityType
    };
  }
}
