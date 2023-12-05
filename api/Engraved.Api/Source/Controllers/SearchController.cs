using Engraved.Core.Application;
using Engraved.Core.Application.Queries.Search;
using Engraved.Core.Application.Queries.Search.Attributes;
using Engraved.Core.Application.Queries.Search.Entities;
using Engraved.Core.Domain;
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
  public async Task<object[]> SearchEntities(string searchText)
  {
    var query = new SearchEntitiesQuery
    {
      SearchText = searchText,
      Limit = 100
    };

    IEntity[] entities = await dispatcher.Query<IEntity[], SearchEntitiesQuery>(query);
    return entities.EnsurePolymorphismWhenSerializing();
  }
}
