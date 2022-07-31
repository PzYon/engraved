using System.Diagnostics;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Metrix.Api.Filters;

public class PerfFilter : IActionFilter
{
  private Stopwatch _stopwatch;

  public void OnActionExecuting(ActionExecutingContext context)
  {
    _stopwatch = Stopwatch.StartNew();
  }

  public void OnActionExecuted(ActionExecutedContext context)
  {
    context.HttpContext.Response.Headers.Add("access-control-expose-headers", "server-action-duration");
    context.HttpContext.Response.Headers.Add("server-action-duration", _stopwatch.ElapsedMilliseconds.ToString());
  }
}
