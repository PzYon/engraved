namespace Engraved.Core.Application.Commands.Entries.Move;

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

  public static MockCurrentUserService Create()
  {
    var mockCurrentUserService = new MockCurrentUserService();
    mockCurrentUserService.SetUserName("hans.peter@peter-hans.ch");
    return mockCurrentUserService;
  }
}
