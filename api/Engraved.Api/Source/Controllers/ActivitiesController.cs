﻿using Engraved.Core.Application;
using Engraved.Core.Application.Queries.Activities;
using Engraved.Core.Application.Queries.Activities.Get;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/activities")]
[Authorize]
public class ActivitiesController : ControllerBase
{
  private readonly Dispatcher _dispatcher;

  public ActivitiesController(Dispatcher dispatcher)
  {
    _dispatcher = dispatcher;
  }

  [HttpGet]
  public async Task<GetActivitiesQueryApiResult> GetAll(string? searchText, string? journalTypes)
  {
    var query = new GetActivitiesQuery
    {
      SearchText = searchText,
      JournalTypes = ControllerUtils.ParseJournalTypes(journalTypes)
    };
    
    GetActivitiesQueryResult result = await _dispatcher.Query(query);
    return GetActivitiesQueryApiResult.FromResult(result);
  }
}

// we need this class in order to support polymorphism for serialization.
// the important thing here is to use object.
public class GetActivitiesQueryApiResult
{
  public object[] Journals { get; set; } = null!;
  public object[] Entries { get; set; } = null!;

  public static GetActivitiesQueryApiResult FromResult(GetActivitiesQueryResult result)
  {
    return new GetActivitiesQueryApiResult
    {
      Entries = result.Entries,
      Journals = result.Journals
    };
  }
}
