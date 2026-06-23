using Engraved.Api.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/auth/refresh")]
[AllowAnonymous]
public class RefreshController(RefreshHandler refreshHandler) : ControllerBase
{
  [HttpPost]
  public async Task<ActionResult<AuthResult>> Refresh([FromBody] RefreshPayload payload)
  {
    AuthResult? result = await refreshHandler.Refresh(payload.RefreshToken);
    return result == null ? Unauthorized() : result;
  }
}
