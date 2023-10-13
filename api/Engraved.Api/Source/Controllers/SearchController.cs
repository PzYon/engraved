﻿using Engraved.Core.Application;
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
  private readonly ISearchIndex _searchIndex;

  public SearchController(Dispatcher dispatcher, ISearchIndex searchIndex)
  {
    _dispatcher = dispatcher;
    _searchIndex = searchIndex;
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

    // it's not good that we inject dependencies here like this,
    // but for the moment it's the easiest. i guess the best solution
    // would be to have the actions be created by the framework's DI.
    searchAttributesQuery.SetSearchIndex(_searchIndex);
    searchAttributesQuery.SetDispatcher(_dispatcher);

    return await _dispatcher.Query<SearchAttributesResult[], SearchAttributesQuery>(searchAttributesQuery);
  }
}
