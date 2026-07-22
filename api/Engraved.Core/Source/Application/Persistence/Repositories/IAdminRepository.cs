namespace Engraved.Core.Application.Persistence.Repositories;

// Admin-only aggregate reads: per-user counts and ownership lookups used by the admin user-overview
// and user-deletion use cases. Always unrestricted - deliberately not available through the
// user-scoped roles, since it exists to look at *other* users' data.
public interface IAdminRepository
{
  Task<long> CountJournalsForUser(string userId);

  Task<long> CountEntriesForUser(string userId);

  Task<string[]> GetJournalIdsForUser(string userId);
}
