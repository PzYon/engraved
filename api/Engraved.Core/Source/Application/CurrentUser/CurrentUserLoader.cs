using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.CurrentUser;

// Creates the Lazy<IUser> representing the current user. The lazy is shared (one instance per
// request scope) by the UserReadScope, the JournalWriteGuard and all consumers, so the user is
// loaded from the database at most once per request - and not at all for requests that never
// touch user-scoped data.
public static class CurrentUserLoader
{
  public static Lazy<IUser> CreateCurrentUserLazy(
    IUserRepository userRepository,
    ICurrentUserService currentUserService
  )
  {
    return new Lazy<IUser>(() =>
      {
        IUser user = currentUserService.LoadUser().Result;
        if (string.IsNullOrEmpty(user.Name))
        {
          throw new NotAllowedOperationException("Current user is not available.");
        }

        IUser? dbUser = userRepository.GetUser(user.Id ?? user.Name).Result;
        return dbUser ?? user;
      }
    );
  }
}
