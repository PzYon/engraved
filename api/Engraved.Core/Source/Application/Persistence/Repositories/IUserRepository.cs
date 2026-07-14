using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Persistence.Repositories;

public interface IUserRepository
{
  Task<IUser?> GetUser(string nameOrId);

  Task<UpsertResult> UpsertUser(IUser user);

  Task<IUser[]> GetUsers(params string[] userIds);

  Task<IUser[]> GetAllUsers();
}
