using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

public class SaliMax
{
  public DateTime Date { get; set; }
}

[ApiController]
[Route("[controller]")]
public class SaliMaxController : ControllerBase
{
  [HttpGet(Name = "Sali Max!")]
  public SaliMax Get()
  {
    return new SaliMax {Date = DateTime.Now};
  }
}