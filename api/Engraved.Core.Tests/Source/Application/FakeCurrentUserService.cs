using System.Threading.Tasks;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application;

public class FakeCurrentUserService(string name) : ICurrentUserService
{
  private string _name = name;

  public string? GetUserName()
  {
    return _name;
  }

  public void SetUserName(string userName)
  {
    _name = userName;
  }

  public Task<IUser> LoadUser()
  {
    return Task.FromResult<IUser>(new User { Name = _name });
  }
}
