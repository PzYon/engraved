using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Users;
using Engraved.Persistence.Mongo.Scoping;

namespace Engraved.Persistence.Mongo.Repositories.UserRestricted;

// Decorator adding the ownership write guard for the current user: only the current user's own
// record may be upserted. Reads pass through unguarded.
public class UserRestrictedUserRepository(MongoUserRepository userRepository, JournalWriteGuard writeGuard)
  : IUserRepository
{
  public Task<IUser?> GetUser(string? nameOrId)
  {
    return userRepository.GetUser(nameOrId);
  }

  public async Task<UpsertResult> UpsertUser(IUser user)
  {
    writeGuard.EnsureEntityBelongsToUser(user.Id);
    return await userRepository.UpsertUser(user);
  }

  public Task<IUser[]> GetUsers(params string[] userIds)
  {
    return userRepository.GetUsers(userIds);
  }

  public Task<IUser[]> GetAllUsers()
  {
    return userRepository.GetAllUsers();
  }

  // Deleting a user is an admin-only operation with no ownership concept (a user cannot "own"
  // themselves the way they own a journal), so it is never available through this restricted role -
  // only through IUnrestrictedRepository (see DeleteUserCommandExecutor).
  public Task DeleteUser(string userId)
  {
    throw new NotAllowedOperationException("Users cannot be deleted through the restricted repository.");
  }
}
