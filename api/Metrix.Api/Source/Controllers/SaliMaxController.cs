using Metrix.Core;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SaliMaxController : ControllerBase
{
  [HttpGet(Name = "Sali Max!")]
  public SaliMax Get()
  {
    var provider = new SaliMaxProvider();
    return provider.GetSaliMax();
  }
}