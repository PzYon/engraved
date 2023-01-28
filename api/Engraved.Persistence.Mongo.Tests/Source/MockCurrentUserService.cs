using Engraved.Core.Application;

namespace Engraved.Persistence.Mongo.Tests;

public class MockCurrentUserService : ICurrentUserService
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
}
