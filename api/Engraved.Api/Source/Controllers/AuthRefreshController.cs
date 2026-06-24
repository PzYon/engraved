using Engraved.Api.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/auth")]
[AllowAnonymous]
public class AuthRefreshController(
  RefreshHandler refreshHandler,
  RefreshTokenService refreshTokenService
) : ControllerBase
{
  [HttpPost("refresh")]
  public async Task<ActionResult<AuthResult>> Refresh([FromBody] RefreshPayload payload)
  {
    AuthResult? result = await refreshHandler.Refresh(payload.RefreshToken);
    return result == null ? Unauthorized() : result;
  }

  [HttpPost("sign-out-other-devices")]
  public async Task<IActionResult> SignOutOtherDevices([FromBody] RefreshPayload payload)
  {
    var success = await refreshTokenService.RevokeOtherTokens(payload.RefreshToken);
    return success ? Ok() : Unauthorized();
  }
}
