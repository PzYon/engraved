using Engraved.Core.Application;
using Engraved.Core.Application.Queries.Search;
using Engraved.Core.Application.Queries.Search.Attributes;
using Engraved.Core.Application.Queries.Search.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/search")]
[Authorize]
public class SearchController(Dispatcher dispatcher) : ControllerBase
{
  [Route("journal_attributes/{journalId}")]
  [HttpGet]
  public async Task<SearchAttributesResult[]> SearchJournalAttributes(string journalId, string searchText)
  {
    var searchAttributesQuery = new SearchAttributesQuery
    {
      JournalId = journalId,
      SearchText = searchText
    };

    return await dispatcher.Query<SearchAttributesResult[], SearchAttributesQuery>(searchAttributesQuery);
  }

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
      Entities = result.Entities
        .Select(e => new SearchResultEntityWeb { Entity = e.Entity, EntityType = e.EntityType })
        .ToArray(),
      Journals = result.Journals.EnsurePolymorphismWhenSerializing()
    };
  }
}

public class SearchResultEntityWeb
{
  public object Entity { get; set; } = null!;

  public EntityType EntityType { get; set; }
}

public class SearchEntitiesResultWeb
{
  public SearchResultEntityWeb[] Entities { get; set; } = Array.Empty<SearchResultEntityWeb>();

  public object[] Journals { get; set; } = Array.Empty<object>();
}
