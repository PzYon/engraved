using Engraved.Core.Application.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/wake/me/up")]
[AllowAnonymous]
public class WakeMeUpController : Controller
{
  private readonly IRepository _repository;

  public WakeMeUpController(IRepository repository)
  {
    _repository = repository;
  }

  [HttpGet]
  public async Task GoogleLogin()
  {
    await _repository.WakeMeUp();
  }
}
