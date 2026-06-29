using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;

namespace Engraved.Core.Application.Persistence;

public interface IJournalRepository
{
  Task<IJournal[]> GetAllJournals(
    string? searchText = null,
    ScheduleMode? scheduleMode = null,
    JournalType[]? journalTypes = null,
    string[]? journalIds = null,
    int? limit = null,
    string? currentUserId = null
  );

  Task<IJournal?> GetJournal(string journalId);

  Task<UpsertResult> UpsertJournal(IJournal journal);

  Task DeleteJournal(string journalId);

  Task ModifyJournalPermissions(string journalId, Dictionary<string, PermissionKind> permissions);

  Task<long> CountAllJournals();
}
