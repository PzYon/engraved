using System.Diagnostics;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Engraved.Api.Filters;

public class PerfFilter : IActionFilter
{
  private const string DurationHeaderName = "server-action-duration";

  private Stopwatch _stopwatch = null!;

  public void OnActionExecuting(ActionExecutingContext context)
  {
    _stopwatch = Stopwatch.StartNew();
  }

  public void OnActionExecuted(ActionExecutedContext context)
  {
    context.HttpContext.Response.Headers.Append("access-control-expose-headers", DurationHeaderName);
    context.HttpContext.Response.Headers.Append(DurationHeaderName, _stopwatch.ElapsedMilliseconds.ToString());
  }
}
