using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Persistence.Repositories;

public interface IUserRepository
{
  Task<IUser?> GetUser(string nameOrId);

  Task<UpsertResult> UpsertUser(IUser user);

  // Writes nothing but the scratchpad, so that it neither overwrites nor is overwritten by
  // UpsertUser.
  Task UpdateScratchpad(string userId, UserScratchpad scratchpad);

  Task<IUser[]> GetUsers(params string[] userIds);

  Task<IUser[]> GetAllUsers();

  Task DeleteUser(string userId);
}
