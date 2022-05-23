using Metrix.Core.Domain.User;

namespace Metrix.Core.Application.Persistence;

public interface IUserScopedRepository : IRepository
{
  Lazy<IUser> CurrentUser { get; }
}
