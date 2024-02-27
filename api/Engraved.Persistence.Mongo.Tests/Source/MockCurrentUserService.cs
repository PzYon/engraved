using System.Threading.Tasks;
using Engraved.Core.Application;
using Engraved.Core.Domain.User;

namespace Engraved.Persistence.Mongo.Tests;

public class MockCurrentUserService : ICurrentUserService
{
  private readonly string _userId;
  private string? _userName;

  public MockCurrentUserService(string userId)
  {
    _userId = userId;
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
    return Task.FromResult(new User { Name = _userName, Id = _userId } as IUser);
  }
}
