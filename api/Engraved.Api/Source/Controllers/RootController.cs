using Engraved.Core.Application.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("")]
public class RootController(IBaseRepository repository) : Controller
{
  [HttpGet]
  public void Get()
  {
    // required to serve keep alive requests from azure. we deliberately
    // call the database in the hope to keep stuff alive.
    repository.WakeMeUp();
  }
}
