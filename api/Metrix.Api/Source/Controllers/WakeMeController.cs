using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

[ApiController]
[Route("api/wake/me/up")]
[AllowAnonymous]
public class WakeMeController : Controller
{
  [HttpGet]
  public async Task GoogleLogin()
  {
  }
}
