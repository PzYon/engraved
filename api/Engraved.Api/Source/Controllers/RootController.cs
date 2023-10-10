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

  public RootController(Engraved.Api.Temp.Dispatcher dispatcher)
  {
    _dispatcher = dispatcher;
  }
  
  [HttpGet]
  public async void Get()
  {
    // required to serve keep alive requests from azure

   string[] result = await _dispatcher.Query(new FooQuery());
   var x = "";
  }
}
