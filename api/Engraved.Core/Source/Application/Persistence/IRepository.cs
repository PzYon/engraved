namespace Engraved.Core.Application.Persistence;

// The full persistence surface, composed from the role interfaces. This is the neutral base shared
// by the two concrete seams - IUserRestrictedRepository (scoped to the current user) and
// IUnrestrictedRepository (no scoping). It is not injected directly; consumers choose one of the two
// seams so that the access model is always explicit at the call site.
public interface IRepository
  : IUserRepository, IJournalRepository, IEntryRepository, IMaintenanceRepository
{
}
