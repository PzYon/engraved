using Engraved.Core.Application;
using Engraved.Core.Application.Queries.SystemInfo.Get;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/system_info")]
[Authorize]
public class SystemInfoController(Dispatcher dispatcher) : Controller
{
  [HttpGet]
  public async Task<SystemInfo> Get()
  {
    return await dispatcher.Query<SystemInfo, GetSystemInfoQuery>(new GetSystemInfoQuery());
  }
}
