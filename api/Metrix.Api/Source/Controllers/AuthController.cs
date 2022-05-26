using Metrix.Api.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

[ApiController]
[Route("api/auth")]
[AllowAnonymous]
public class AuthController : Controller
{
  private readonly ILoginHandler _loginHandler;

  public AuthController(ILoginHandler loginHandler)
  {
    _loginHandler = loginHandler;
  }

  [HttpPost("google")]
  public async Task<AuthResult> GoogleLogin(LoginPayload payload)
  {
    return await _loginHandler.Login(payload.Token);
  }
}
