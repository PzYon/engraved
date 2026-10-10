using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Persistence.Repositories;

public interface IUserRepository
{
  Task<IUser?> GetUser(string nameOrId);

  Task<UpsertResult> UpsertUser(IUser user);

  // Writes nothing but the scratchpad, and only if it has not been saved since lastKnownEditedOn
  // (null: never saved). Returns false if it has.
  Task<bool> UpdateScratchpad(string userId, UserScratchpad scratchpad, DateTime? lastKnownEditedOn);

  Task<IUser[]> GetUsers(params string[] userIds);

  Task<IUser[]> GetAllUsers();

  Task DeleteUser(string userId);
}
