using Engraved.Core.Domain.User;

namespace Engraved.Core.Application.Persistence;

public interface IUserScopedRepository : IRealRepository
{
  Lazy<IUser> CurrentUser { get; }
}
