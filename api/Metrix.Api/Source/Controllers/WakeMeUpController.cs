using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

[ApiController]
[Route("api/wake/me/up")]
[AllowAnonymous]
public class WakeMeUpController : Controller
{
  [HttpGet]
  public Task GoogleLogin()
  {
    return Task.CompletedTask;
  }
}
