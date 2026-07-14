namespace Engraved.Core.Application.Persistence.Repositories;

// System/maintenance operations that are not tied to a single entity and are not user-scoped:
// the keep-alive ping and the global entity counts used for system info.
public interface IMaintenanceRepository
{
  Task WakeMeUp();

  Task<long> CountAllUsers();

  Task<long> CountAllJournals();

  Task<long> CountAllEntries();
}
