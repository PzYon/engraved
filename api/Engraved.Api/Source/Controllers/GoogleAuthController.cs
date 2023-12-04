using Engraved.Api.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/auth/google")]
[AllowAnonymous]
public class GoogleAuthController(ILoginHandler loginHandler) : Controller
{
  [HttpPost]
  public async Task<AuthResult> GoogleLogin(LoginPayload payload)
  {
    return await loginHandler.Login(payload.Token);
  }
}
