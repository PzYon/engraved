using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Metrix.Api.Filters;

public class HttpExceptionFilter : IActionFilter
{
  public void OnActionExecuting(ActionExecutingContext context) { }

  public void OnActionExecuted(ActionExecutedContext context)
  {
    if (context.Exception == null)
    {
      return;
    }

    context.Result = new ObjectResult(ApiError.FromException(context.Exception))
    {
      StatusCode = 500
    };

    context.ExceptionHandled = true;
  }
}
