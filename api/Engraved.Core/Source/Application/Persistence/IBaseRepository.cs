using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Persistence;

public interface IBaseRepository
{
  Task<IUser?> GetUser(string nameOrId);

  Task<UpsertResult> UpsertUser(IUser user);

  Task<IUser[]> GetUsers(params string[] userIds);

  Task<IUser[]> GetAllUsers();

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

  Task<IEntry[]> GetEntriesForJournal(
    string journalId,
    DateTime? fromDate,
    DateTime? toDate,
    IDictionary<string, string[]>? attributeValues,
    string? searchText
  );

  Task<IEntry[]> SearchEntries(
    string? searchText = null,
    ScheduleMode? scheduleMode = null,
    JournalType[]? journalTypes = null,
    string[]? journalIds = null,
    int? limit = null,
    string? currentUserId = null
  );

  Task<UpsertResult> UpsertEntry<TEntry>(TEntry entry) where TEntry : IEntry;

  Task DeleteEntry(string entryId);

  Task<IEntry?> GetEntry(string entryId);

  Task WakeMeUp();

  Task<long> CountAllUsers();

  Task<long> CountAllEntries();

  Task<long> CountAllJournals();
}
