using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;

namespace Engraved.Persistence.Mongo.Repositories;

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
}
