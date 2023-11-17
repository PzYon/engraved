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
}
