using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Users;
using Engraved.Persistence.Mongo;
using Engraved.Persistence.Mongo.DocumentTypes.Entries;
using Engraved.Persistence.Mongo.DocumentTypes.Journals;
using Engraved.Persistence.Mongo.DocumentTypes.Users;
using Engraved.Persistence.Mongo.Repositories;
using Engraved.Persistence.Mongo.Repositories.UserRestricted;
using Engraved.Persistence.Mongo.Scoping;
using MongoDB.Driver;

namespace Engraved.TestUtils.Source;

// Test convenience bundle: composes the user-restricted repositories exactly like the DI wiring in
// PersistenceRegistration (production has no composite type anymore - executors inject the role
// interfaces plus Lazy<IUser> directly), and exposes the raw collections so tests can
// arrange/assert directly in the database.
public class TestUserRestrictedMongoRepository : IUserRepository, IJournalRepository, IEntryRepository
{
  private readonly UserRestrictedEntryRepository _entryRepository;
  private readonly UserRestrictedJournalRepository _journalRepository;
  private readonly MongoDatabaseClient _mongoDatabaseClient;
  private readonly UserRestrictedUserRepository _userRepository;

  public TestUserRestrictedMongoRepository(
    MongoDatabaseClient mongoDatabaseClient,
    ICurrentUserService currentUserService
  )
  {
    _mongoDatabaseClient = mongoDatabaseClient;
    CurrentUser = CurrentUserLoader.CreateCurrentUserLazy(mongoDatabaseClient, currentUserService);

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

  public IMongoCollection<JournalDocument> Journals => _mongoDatabaseClient.JournalsCollection;
  public IMongoCollection<EntryDocument> Entries => _mongoDatabaseClient.EntriesCollection;
  public IMongoCollection<UserDocument> Users => _mongoDatabaseClient.UsersCollection;

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

  public Task DeleteEntriesForJournal(string journalId)
  {
    return _entryRepository.DeleteEntriesForJournal(journalId);
  }

  public Task<IEntry?> GetEntry(string entryId)
  {
    return _entryRepository.GetEntry(entryId);
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
}
