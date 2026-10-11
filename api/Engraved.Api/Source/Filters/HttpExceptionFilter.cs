using Engraved.Api.Authentication;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries;
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
      StatusCode = GetStatusCode(context.Exception)
    };

    context.ExceptionHandled = true;
  }

  private static int GetStatusCode(Exception exception)
  {
    return exception switch
    {
      ITokenValidationException => StatusCodes.Status401Unauthorized,
      NotAllowedOperationException => StatusCodes.Status403Forbidden,
      InvalidCommandException or InvalidQueryException => StatusCodes.Status400BadRequest,
      _ => StatusCodes.Status500InternalServerError
    };
  }
}
