using Engraved.Core.Application;
using Engraved.Core.Application.Queries.Search.Attributes;
using Engraved.Core.Application.Search;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/search")]
[Authorize]
public class SearchController : ControllerBase
{
  private readonly Dispatcher _dispatcher;

  public SearchController(Dispatcher dispatcher)
  {
    _dispatcher = dispatcher;
  }

  [Route("journal_attributes/{journalId}")]
  [HttpGet]
  public async Task<SearchAttributesResult[]> SearchJournalAttributes(string journalId, string searchText)
  {
    var searchAttributesQuery = new SearchAttributesQuery
    {
      JournalId = journalId,
      SearchText = searchText
    };

    return await _dispatcher.Query<SearchAttributesResult[], SearchAttributesQuery>(searchAttributesQuery);
  }
}
