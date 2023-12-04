using Engraved.Core.Application.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/wake/me/up")]
[AllowAnonymous]
public class WakeMeUpController(IBaseRepository repository) : Controller
{
  [HttpGet]
  public async Task WakeMeUp()
  {
    await repository.WakeMeUp();
  }
}
