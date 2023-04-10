using Engraved.Core.Application;
using Engraved.Core.Application.Queries.Activities;
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
  public async Task<object> GetAll()
  {
    GetActivitiesQueryResult result = await _dispatcher.Query(new GetActivitiesQuery());
    return result;
  }
}
