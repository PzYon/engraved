using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.User;

namespace Engraved.Core.Application.Persistence;

public interface IBaseRepository
{
  Task<IUser?> GetUser(string name);

  Task<UpsertResult> UpsertUser(IUser user);

  Task<IUser[]> GetUsers(params string[] userIds);

  Task<IUser[]> GetAllUsers();

  Task<IJournal[]> GetAllJournals(
    string? searchText = null,
    bool scheduledOnly = false,
    JournalType[]? journalTypes = null,
    string[]? journalIds = null,
    int? limit = null
  );

  Task<IJournal?> GetJournal(string journalId);

  Task<UpsertResult> UpsertJournal(IJournal journal);

  Task DeleteJournal(string journalId);

  Task ModifyJournalPermissions(string journalId, Dictionary<string, PermissionKind> permissions);

  Task<IEntry[]> GetAllEntries(
    string journalId,
    DateTime? fromDate,
    DateTime? toDate,
    IDictionary<string, string[]>? attributeValues
  );

  Task<IEntry[]> GetLastEditedEntries(
    string? searchText = null,
    bool scheduledOnly = false,
    JournalType[]? journalTypes = null,
    string[]? journalIds = null,
    int? limit = null
  );

  Task<UpsertResult> UpsertEntry<TEntry>(TEntry entry) where TEntry : IEntry;

  Task DeleteEntry(string entryId);

  Task<IEntry?> GetEntry(string entryId);

  Task WakeMeUp();

  Task<long> CountAllUsers();

  Task<long> CountAllEntries();

  Task<long> CountAllJournals();
}
