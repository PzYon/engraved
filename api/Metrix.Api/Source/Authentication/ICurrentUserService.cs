namespace Metrix.Api.Authentication;

public interface ICurrentUserService
{
  string? GetUserName();
  void SetUserName(string userName);
}
