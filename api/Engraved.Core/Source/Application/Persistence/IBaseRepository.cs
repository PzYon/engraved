namespace Engraved.Core.Application.Persistence;

// Composes the cohesive, role-based persistence interfaces. Kept as an umbrella
// so existing consumers (and the DI markers IRepository / IUserScopedRepository)
// continue to see the full surface, while new code can depend on just the
// narrow role interface(s) it actually needs.
public interface IBaseRepository
  : IUserRepository, IJournalRepository, IEntryRepository, IMaintenanceRepository
{
}
