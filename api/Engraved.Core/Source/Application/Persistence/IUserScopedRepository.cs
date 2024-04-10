using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Persistence;

public interface IUserScopedRepository : IRepository
{
  Lazy<IUser> CurrentUser { get; }
}
