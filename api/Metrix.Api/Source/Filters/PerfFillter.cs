using System.Diagnostics;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Metrix.Api.Filters;

public class PerfFilter : IActionFilter
{
  private static readonly string durationHeaderName = "server-action-duration";

  private Stopwatch _stopwatch;

  public void OnActionExecuting(ActionExecutingContext context)
  {
    _stopwatch = Stopwatch.StartNew();
  }

  public void OnActionExecuted(ActionExecutedContext context)
  {
    context.HttpContext.Response.Headers.Add("access-control-expose-headers", durationHeaderName);
    context.HttpContext.Response.Headers.Add(durationHeaderName, _stopwatch.ElapsedMilliseconds.ToString());
  }
}
