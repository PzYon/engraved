using Metrix.Core;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class SaliMaxController : ControllerBase
{
  [HttpGet(Name = "Sali Max!")]
  public SaliMax Get()
  {
    var provider = new SaliMaxProvider();
    return provider.GetSaliMax();
  }
}