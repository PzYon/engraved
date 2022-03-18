namespace Metrix.Api.Filters;

public class ApiError
{
  public string Message { get; set; }

  public string? Stacktrace { get; set; }

  public static ApiError FromException(Exception ex)
  {
    return new ApiError
    {
      Message = ex.Message,
      Stacktrace = ex.StackTrace
    };
  }
}
