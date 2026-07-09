using Engraved.Core.Application;
using Engraved.Core.Application.Queries.Search.Entities;
using Engraved.Core.Application.Queries.Search.Related;
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
  public async Task<SearchEntitiesResult> SearchEntities(
    string? searchText,
    bool? onlyConsiderTitle,
    bool? scheduledOnly,
    string? onlyEntriesOfTypes
  )
  {
    var query = new SearchEntitiesQuery
    {
      SearchText = searchText ?? "",
      Limit = 30,
      ScheduledOnly = scheduledOnly.HasValue && scheduledOnly.Value,
      OnlyEntriesOfTypes = ControllerUtils.ParseJournalTypes(onlyEntriesOfTypes),
      OnlyConsiderTitle = onlyConsiderTitle
    };

    return await dispatcher.Query<SearchEntitiesResult, SearchEntitiesQuery>(query);
  }

  [Route("related")]
  [HttpGet]
  public async Task<SearchEntitiesResult> GetRelatedEntities(string entityId, EntityType entityType)
  {
    var query = new GetRelatedEntitiesQuery
    {
      EntityId = entityId,
      EntityType = entityType
    };

    return await dispatcher.Query<SearchEntitiesResult, GetRelatedEntitiesQuery>(query);
  }
}
