namespace Metrix.Api.Authentication;

public class CurrentUserService : ICurrentUserService
{
  private readonly IHttpContextAccessor _httpContextAccessor;

  const string Key = "AuthenticatedUserId";

  public CurrentUserService(IHttpContextAccessor httpContextAccessor)
  {
    _httpContextAccessor = httpContextAccessor;
  }

  public string? GetUserName()
  {
    if (_httpContextAccessor.HttpContext == null)
    {
      throw new Exception("HttpContext is not set");
    }

    return _httpContextAccessor.HttpContext.Items[Key] as string;
  }

  public void SetUserName(string userName)
  {
    if (_httpContextAccessor.HttpContext == null)
    {
      throw new Exception("HttpContext is not set");
    }

    _httpContextAccessor.HttpContext.Items[Key] = userName;
  }
}
