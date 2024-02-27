using System.Threading.Tasks;
using Engraved.Core.Domain.User;

namespace Engraved.Core.Application;

public class FakeCurrentUserService : ICurrentUserService
{
  private string _userName;

  public FakeCurrentUserService(string userName)
  {
    _userName = userName;
  }

  public string? GetUserName()
  {
    return _userName;
  }

  public void SetUserName(string userName)
  {
    _userName = userName;
  }

  public Task<IUser> LoadUser()
  {
    return Task.FromResult(new User { Name = _userName } as IUser);
  }
}
