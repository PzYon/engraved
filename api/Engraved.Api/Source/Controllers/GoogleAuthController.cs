using Engraved.Api.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/auth/google")]
[AllowAnonymous]
public class GoogleAuthController : Controller
{
  private readonly ILoginHandler _loginHandler;

  public GoogleAuthController(ILoginHandler loginHandler)
  {
    _loginHandler = loginHandler;
  }

  [HttpPost]
  public async Task<AuthResult> GoogleLogin(LoginPayload payload)
  {
    return await _loginHandler.Login(payload.Token);
  }
}