namespace Engraved.Core.Application.Persistence.Repositories;

// The unrestricted seam: full persistence access with NO permission or user scoping applied,
// including the inherently-unrestricted maintenance operations (keep-alive, global counts). Resolves
// to the raw UnrestrictedMongoRepository. Inject this only where there is deliberately no current
// user to scope to: the notification job (runs across all users), authentication/login (runs before
// a user context exists) and health endpoints.
//
// It is a distinct, greppable type - not the user-restricted role registrations that
// IUserRepository/IJournalRepository/IEntryRepository resolve to - so unrestricted access is always
// a conscious choice and can never be obtained by accident.
public interface IUnrestrictedRepository
  : IUserRepository, IJournalRepository, IEntryRepository, IMaintenanceRepository, IAdminRepository { }
