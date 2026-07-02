using Engraved.Core.Application.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("")]
public class RootController(IUnrestrictedRepository unrestrictedRepository) : Controller
{
  [HttpGet]
  public async Task Get()
  {
    // required to serve keep alive requests from azure. we deliberately
    // call the database in the hope to keep stuff alive.
    await unrestrictedRepository.WakeMeUp();
  }
}
