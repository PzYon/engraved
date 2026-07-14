using Engraved.Core.Application.Persistence.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/wake/me/up")]
[AllowAnonymous]
public class WakeMeUpController(IUnrestrictedRepository unrestrictedRepository) : Controller
{
  [HttpGet]
  public async Task WakeMeUp()
  {
    await unrestrictedRepository.WakeMeUp();
  }
}
