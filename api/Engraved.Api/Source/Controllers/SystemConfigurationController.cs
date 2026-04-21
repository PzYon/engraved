using Engraved.Core.Application.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/system_config")]
[Authorize]
public class SystemConfigurationController(QueryCache queryCache) : ControllerBase
{
  [HttpPost]
  [Route("clear-cache")]
  public void ClearCache()
  {
    queryCache.ClearCurrentUser();
  }
}
