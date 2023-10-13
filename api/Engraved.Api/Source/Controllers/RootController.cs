using Engraved.Api.Temp;
using Engraved.Core.Application;
using Microsoft.AspNetCore.Mvc;
using Controller = Microsoft.AspNetCore.Mvc.Controller;
using Dispatcher = Engraved.Api.Temp.Dispatcher;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("")]
public class RootController : Controller
{
  private readonly Dispatcher _dispatcher;

  public RootController(Dispatcher dispatcher)
  {
    _dispatcher = dispatcher;
  }

  [HttpGet]
  public async void Get()
  {
    // required to serve keep alive requests from azure

    string[] result = await _dispatcher.Query<string[], FooQuery>(new FooQuery());
    var x = "";
  }
}
