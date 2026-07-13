using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;
using Engraved.Persistence.Mongo.Repositories;
using Engraved.Persistence.Mongo.Scoping;

namespace Engraved.Persistence.Mongo;

// Permission/owner-filtered access for the current user: composes the per-aggregate repositories
// (reads shaped by UserReadScope) with the write-guard decorators (JournalWriteGuard applies the
// same rule in memory). Exists as a class only because IUserRestrictedRepository is the single
// injection seam the executors use; all behavior lives in the composed parts.
public class UserRestrictedMongoRepository : IUserRestrictedRepository
{
  private readonly UserRestrictedUserRepository _userRepository;
  private readonly UserRestrictedJournalRepository _journalRepository;
  private readonly UserRestrictedEntryRepository _entryRepository;

  public UserRestrictedMongoRepository(
    MongoDatabaseClient mongoDatabaseClient,
    ICurrentUserService currentUserService
  )
  {
    CurrentUser = CreateCurrentUserLazy(mongoDatabaseClient, currentUserService);

    var journalRepository = new MongoJournalRepository(mongoDatabaseClient, new UserReadScope(CurrentUser));
    var writeGuard = new JournalWriteGuard(journalRepository, CurrentUser);

    _userRepository = new UserRestrictedUserRepository(new MongoUserRepository(mongoDatabaseClient), writeGuard);
    _journalRepository = new UserRestrictedJournalRepository(journalRepository, writeGuard);
    _entryRepository = new UserRestrictedEntryRepository(
      new MongoEntryRepository(mongoDatabaseClient, journalRepository),
      writeGuard
    );
  }

  public Lazy<IUser> CurrentUser { get; }

  public Task<IUser?> GetUser(string? nameOrId)
  {
    return _userRepository.GetUser(nameOrId);
  }

  public Task<UpsertResult> UpsertUser(IUser user)
  {
    return _userRepository.UpsertUser(user);
  }

  public Task<IUser[]> GetUsers(params string[] userIds)
  {
    return _userRepository.GetUsers(userIds);
  }

  public Task<IUser[]> GetAllUsers()
  {
    return _userRepository.GetAllUsers();
  }

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
    return _journalRepository.GetAllJournals(
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
    return _journalRepository.GetJournal(journalId);
  }

  public Task<UpsertResult> UpsertJournal(IJournal journal)
  {
    return _journalRepository.UpsertJournal(journal);
  }

  public Task DeleteJournal(string journalId)
  {
    return _journalRepository.DeleteJournal(journalId);
  }

  public Task ModifyJournalPermissions(string journalId, Dictionary<string, PermissionKind> permissions)
  {
    return _journalRepository.ModifyJournalPermissions(journalId, permissions);
  }

  public Task<IEntry[]> GetEntriesForJournal(
    string journalId,
    DateTime? fromDate = null,
    DateTime? toDate = null,
    IDictionary<string, string[]>? attributeValues = null,
    string? searchText = null,
    SortEntriesBy sortOrder = SortEntriesBy.DateTime
  )
  {
    return _entryRepository.GetEntriesForJournal(journalId, fromDate, toDate, attributeValues, searchText, sortOrder);
  }

  public Task<IEntry[]> SearchEntries(
    string? searchText,
    ScheduleMode? scheduleMode = null,
    JournalType[]? journalTypes = null,
    string[]? journalIds = null,
    int? limit = null,
    string? currentUserId = null,
    bool onlyConsiderTitle = false,
    bool matchAnyWord = false
  )
  {
    return _entryRepository.SearchEntries(
      searchText,
      scheduleMode,
      journalTypes,
      journalIds,
      limit,
      currentUserId,
      onlyConsiderTitle,
      matchAnyWord
    );
  }

  public Task<UpsertResult> UpsertEntry<TEntry>(TEntry entry)
    where TEntry : IEntry
  {
    return _entryRepository.UpsertEntry(entry);
  }

  public Task DeleteEntry(string entryId)
  {
    return _entryRepository.DeleteEntry(entryId);
  }

  public Task<IEntry?> GetEntry(string entryId)
  {
    return _entryRepository.GetEntry(entryId);
  }

  private static Lazy<IUser> CreateCurrentUserLazy(
    MongoDatabaseClient mongoDatabaseClient,
    ICurrentUserService currentUserService
  )
  {
    var userRepository = new MongoUserRepository(mongoDatabaseClient);

    return new Lazy<IUser>(() =>
      {
        IUser user = currentUserService.LoadUser().Result;
        if (string.IsNullOrEmpty(user.Name))
        {
          throw new NotAllowedOperationException("Current user is not available.");
        }

        IUser? dbUser = userRepository.GetUser(user.Id ?? user.Name).Result;
        return dbUser ?? user;
      }
    );
  }
}
