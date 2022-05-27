using Metrix.Core.Domain.User;

namespace Metrix.Core.Application.Persistence.Demo;

public class UserScopedInMemoryRepository : InMemoryRepository, IUserScopedRepository
{
  private readonly string _userId;

  public Lazy<IUser> CurrentUser => new(LoadUser);

  public UserScopedInMemoryRepository(string userId)
  {
    _userId = userId;
  }

  private IUser LoadUser()
  {
    IUser? result = base.GetUser(_userId).Result;

    if (result == null)
    {
      throw new UnallowedOperationException($"Current user '{_userId}' does not exist.");
    }

    return result;
  }
}
