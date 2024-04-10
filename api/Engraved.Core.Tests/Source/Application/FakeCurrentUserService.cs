using System.Threading.Tasks;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application;

public class FakeCurrentUserService(string name) : ICurrentUserService
{
  public string? GetUserName()
  {
    return name;
  }

  public void SetUserName(string userName)
  {
    name = userName;
  }

  public Task<IUser> LoadUser()
  {
    return Task.FromResult(new User { Name = name } as IUser);
  }
}
