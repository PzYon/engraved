namespace Engraved.Core.Application.Persistence;

// The explicit unrestricted seam: full persistence access with NO permission or user scoping
// applied. Resolves to the raw MongoRepository. Inject this only where there is deliberately no
// current user to scope to: the notification job (runs across all users), authentication/login
// (runs before a user context exists) and health endpoints.
//
// It is a distinct, greppable type - not a base of the scoped IRepository - so unrestricted access
// is always a conscious choice and can never be obtained by accident.
public interface IUnrestrictedRepository
  : IUserRepository, IJournalRepository, IEntryRepository, IMaintenanceRepository
{
}
