using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.User;

namespace Engraved.Api.Authentication;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor, UserLoader userLoader)
  : ICurrentUserService
{
  private const string Key = "AuthenticatedUserId";

  public string? GetUserName()
  {
    if (httpContextAccessor.HttpContext == null)
    {
      throw new Exception("HttpContext is not set");
    }

    return httpContextAccessor.HttpContext.Items[Key] as string;
  }

  public void SetUserName(string userName)
  {
    if (httpContextAccessor.HttpContext == null)
    {
      throw new Exception("HttpContext is not set");
    }

    httpContextAccessor.HttpContext.Items[Key] = userName;
  }

  public async Task<IUser> LoadUser()
  {
    string? name = GetUserName();

    if (string.IsNullOrEmpty(name))
    {
      throw new NotAllowedOperationException("Username is not available");
    }

    return await userLoader.GetUser(name);
  }
}
