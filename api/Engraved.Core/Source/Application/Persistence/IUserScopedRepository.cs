using Engraved.Core.Domain.User;

namespace Engraved.Core.Application.Persistence;

public interface IUserScopedRepository : IRepository
{
  Lazy<IUser> CurrentUser { get; }
}
