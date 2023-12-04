using Engraved.Core.Application;
using Engraved.Core.Application.Queries.Search;
using Engraved.Core.Application.Queries.Search.Attributes;
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
}
