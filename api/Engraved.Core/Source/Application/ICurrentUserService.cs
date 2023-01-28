namespace Engraved.Core.Application;

public interface ICurrentUserService
{
  string? GetUserName();
  void SetUserName(string userName);
}
