using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;
using Engraved.Persistence.Mongo.DocumentTypes.Entries;
using Engraved.Persistence.Mongo.DocumentTypes.Journals;
using Engraved.Persistence.Mongo.DocumentTypes.Users;
using Engraved.Persistence.Mongo.Repositories;
using Engraved.Persistence.Mongo.Scoping;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo;

// Delegating facade over the per-aggregate repositories (MongoUserRepository,
// MongoJournalRepository, MongoEntryRepository), which do the actual data access shaped by the
// injected IReadScope. Only composition and the write-guard override points (the virtual methods
// UserRestrictedMongoRepository hooks into) live here; the plan is to dissolve this class entirely
// once the guards become decorators.
public abstract class MongoRepositoryBase : IUserRepository, IJournalRepository, IEntryRepository
{
  private readonly MongoDatabaseClient _mongoDatabaseClient;
  private readonly MongoUserRepository _userRepository;
  private readonly MongoJournalRepository _journalRepository;
  private readonly MongoEntryRepository _entryRepository;

  protected MongoRepositoryBase(MongoDatabaseClient mongoDatabaseClient, IReadScope readScope)
  {
    _mongoDatabaseClient = mongoDatabaseClient;
    _userRepository = new MongoUserRepository(mongoDatabaseClient);
    _journalRepository = new MongoJournalRepository(mongoDatabaseClient, readScope);
    _entryRepository = new MongoEntryRepository(mongoDatabaseClient, _journalRepository);
  }

  // protected so they can be accessed from derived repositories (and the test repositories)
  protected IMongoCollection<EntryDocument> EntriesCollection => _mongoDatabaseClient.EntriesCollection;
  protected IMongoCollection<JournalDocument> JournalsCollection => _mongoDatabaseClient.JournalsCollection;
  protected IMongoCollection<UserDocument> UsersCollection => _mongoDatabaseClient.UsersCollection;

  public Task<IUser?> GetUser(string? nameOrId)
  {
    return _userRepository.GetUser(nameOrId);
  }

  public virtual Task<UpsertResult> UpsertUser(IUser user)
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

  public virtual Task<UpsertResult> UpsertJournal(IJournal journal)
  {
    return _journalRepository.UpsertJournal(journal);
  }

  public virtual Task DeleteJournal(string journalId)
  {
    return _journalRepository.DeleteJournal(journalId);
  }

  public Task ModifyJournalPermissions(string journalId, Dictionary<string, PermissionKind> permissions)
  {
    return _journalRepository.ModifyJournalPermissions(journalId, permissions);
  }

  // Explicitly unscoped read: loads the journal regardless of the caller's read permissions, so the
  // write guards can apply the permission rule in memory.
  protected Task<IJournal?> GetJournalUnscoped(string journalId)
  {
    return _journalRepository.GetJournalUnscoped(journalId);
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

  public virtual Task<UpsertResult> UpsertEntry<TEntry>(TEntry entry)
    where TEntry : IEntry
  {
    return _entryRepository.UpsertEntry(entry);
  }

  public virtual Task DeleteEntry(string entryId)
  {
    return _entryRepository.DeleteEntry(entryId);
  }

  public Task<IEntry?> GetEntry(string entryId)
  {
    return _entryRepository.GetEntry(entryId);
  }
}
