using Engraved.Core.Application.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/wake/me/up")]
[AllowAnonymous]
public class WakeMeUpController : Controller
{
  private readonly IBaseRepository _repository;

  public WakeMeUpController(IBaseRepository repository)
  {
    _repository = repository;
  }

  [HttpGet]
  public async Task WakeMeUp()
  {
    await _repository.WakeMeUp();
  }
}
