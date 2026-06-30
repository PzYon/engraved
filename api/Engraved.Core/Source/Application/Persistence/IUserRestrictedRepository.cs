using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Persistence;

// The user-restricted seam: every operation is permission/owner filtered for the current user.
// Composes only the roles a per-user repository needs - notably NOT IMaintenanceRepository, since
// global maintenance/count operations are inherently unrestricted. Resolves to
// UserScopedMongoRepository and exposes the CurrentUser the scoping is based on.
public interface IUserRestrictedRepository
  : IUserRepository, IJournalRepository, IEntryRepository
{
  Lazy<IUser> CurrentUser { get; }
}
