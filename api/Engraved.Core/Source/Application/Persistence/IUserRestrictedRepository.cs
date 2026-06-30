using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Persistence;

// The user-restricted seam: every operation is permission/owner filtered for the current user.
// Resolves to UserScopedMongoRepository and exposes the CurrentUser the scoping is based on.
public interface IUserRestrictedRepository : IRepository
{
  Lazy<IUser> CurrentUser { get; }
}
