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

// Full persistence access with no permission/user scoping: composes the plain per-aggregate
// repositories (reads shaped by UnrestrictedReadScope, no write guards), plus the
// inherently-unrestricted maintenance operations (keep-alive, global counts). Exists as a class
// only because IUnrestrictedRepository is the deliberate, greppable seam for unrestricted access.
public class UnrestrictedMongoRepository : IUnrestrictedRepository
{
  private const string RandomDocId = "63f949da880b5bf2518be721";

  private readonly MongoDatabaseClient _mongoDatabaseClient;
  private readonly MongoUserRepository _userRepository;
  private readonly MongoJournalRepository _journalRepository;
  private readonly MongoEntryRepository _entryRepository;

  public UnrestrictedMongoRepository(MongoDatabaseClient mongoDatabaseClient)
  {
    _mongoDatabaseClient = mongoDatabaseClient;
    _userRepository = new MongoUserRepository(mongoDatabaseClient);
    _journalRepository = new MongoJournalRepository(mongoDatabaseClient, UnrestrictedReadScope.Instance);
    _entryRepository = new MongoEntryRepository(mongoDatabaseClient, _journalRepository);
  }

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

  public async Task WakeMeUp()
  {
    await _mongoDatabaseClient.UsersCollection.FindAsync(MongoUtil.GetDocumentByIdFilter<UserDocument>(RandomDocId));
  }

  public async Task<long> CountAllUsers()
  {
    return await _mongoDatabaseClient.UsersCollection.CountDocumentsAsync(
      Builders<UserDocument>.Filter.Empty,
      new CountOptions { Hint = "_id_" }
    );
  }

  public async Task<long> CountAllEntries()
  {
    return await _mongoDatabaseClient.EntriesCollection.CountDocumentsAsync(
      Builders<EntryDocument>.Filter.Empty,
      new CountOptions { Hint = "_id_" }
    );
  }

  public async Task<long> CountAllJournals()
  {
    return await _mongoDatabaseClient.JournalsCollection.CountDocumentsAsync(
      Builders<JournalDocument>.Filter.Empty,
      new CountOptions { Hint = "_id_" }
    );
  }
}
