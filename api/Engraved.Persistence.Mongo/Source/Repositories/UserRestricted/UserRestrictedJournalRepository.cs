using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Journals;
using Engraved.Persistence.Mongo.Scoping;

namespace Engraved.Persistence.Mongo.Repositories.UserRestricted;

// Decorator adding the write guards for the current user on top of the (read-scoped) journal
// repository. Reads pass through - they are shaped by the UserReadScope injected into the inner
// repository.
public class UserRestrictedJournalRepository(MongoJournalRepository journalRepository, JournalWriteGuard writeGuard)
  : IJournalRepository
{
  public Task<IJournal[]> GetAllJournals(
    string? searchText = null,
    ScheduleMode? scheduleMode = null,
    JournalType[]? journalTypes = null,
    string[]? journalIds = null,
    int? limit = null,
    string? currentUserId = null,
    bool matchAnyWord = false
  )
  {
    return journalRepository.GetAllJournals(
      searchText,
      scheduleMode,
      journalTypes,
      journalIds,
      limit,
      currentUserId,
      matchAnyWord
    );
  }

  public Task<IJournal?> GetJournal(string journalId)
  {
    return journalRepository.GetJournal(journalId);
  }

  public async Task<UpsertResult> UpsertJournal(IJournal journal)
  {
    if (!string.IsNullOrEmpty(journal.Id))
    {
      IJournal? existingJournal = await journalRepository.GetJournalUnscoped(journal.Id);

      if (existingJournal != null)
      {
        await writeGuard.EnsureUserHasWritePermission(journal.Id);

        // ensure we don't accidentally change the owner if it's an update
        journal.UserId = existingJournal.UserId;
        return await journalRepository.UpsertJournal(journal);
      }
    }

    writeGuard.EnsureUserId(journal);

    return await journalRepository.UpsertJournal(journal);
  }

  public async Task DeleteJournal(string journalId)
  {
    await writeGuard.EnsureUserHasWritePermission(journalId);
    await journalRepository.DeleteJournal(journalId);
  }
}
