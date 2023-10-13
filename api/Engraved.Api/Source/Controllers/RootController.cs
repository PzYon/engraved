using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("")]
public class RootController : Controller
{
  [HttpGet]
  public void Get()
  {
    // required to serve keep alive requests from azure
  }
}
