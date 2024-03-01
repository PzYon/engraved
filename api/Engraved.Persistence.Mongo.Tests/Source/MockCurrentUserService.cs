using System.Threading.Tasks;
using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.User;

namespace Engraved.Persistence.Mongo.Tests;

public class MockCurrentUserService(string userId) : ICurrentUserService
{
  private string? _userName;

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
    if (string.IsNullOrEmpty(_userName))
    {
      throw new NotAllowedOperationException("Username is not available");
    }

    return Task.FromResult(new User { Name = _userName, Id = userId } as IUser);
  }
}
