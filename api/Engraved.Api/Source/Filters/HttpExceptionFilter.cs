using Engraved.Api.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Engraved.Api.Filters;

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
      StatusCode = context.Exception is ITokenValidationException ? 401 : 500
    };

    context.ExceptionHandled = true;
  }
}
