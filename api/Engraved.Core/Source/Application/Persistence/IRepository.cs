namespace Engraved.Core.Application.Persistence;

// The user-scoped persistence surface: resolves to UserScopedMongoRepository, so every operation is
// permission/owner filtered for the current user. IUserScopedRepository extends this to also expose
// the CurrentUser.
public interface IRepository
  : IUserRepository, IJournalRepository, IEntryRepository, IMaintenanceRepository
{
}
