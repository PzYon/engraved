﻿using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Persistence.Demo;

public class UserScopedInMemoryRepository : IUserScopedRepository
{
  private readonly InMemoryRepository _repository;
  private readonly ICurrentUserService _currentUserService;

  public List<IUser> Users => _repository.Users;

  public List<IJournal> Journals => _repository.Journals;

  public List<IEntry> Entries => _repository.Entries;

  public Lazy<IUser> CurrentUser { get; }

  public UserScopedInMemoryRepository(InMemoryRepository repository, ICurrentUserService currentUserService)
  {
    _repository = repository;
    _currentUserService = currentUserService;
    CurrentUser = new Lazy<IUser>(LoadUser);
  }

  public Task<IUser?> GetUser(string nameOrId)
  {
    return _repository.GetUser(nameOrId);
  }

  public Task<UpsertResult> UpsertUser(IUser user)
  {
    return _repository.UpsertUser(user);
  }

  public Task<IUser[]> GetUsers(string[] userIds)
  {
    return _repository.GetAllUsers();
  }

  public async Task<IUser[]> GetAllUsers()
  {
    return (await _repository.GetAllUsers())
      .Where(u => u.Id == CurrentUser.Value.Id)
      .ToArray();
  }

  public async Task<IJournal[]> GetAllJournals(
    string? searchText,
    ScheduleMode? scheduleMode = null,
    JournalType[]? journalTypes = null,
    string[]? journalIds = null,
    int? limit = null,
    string? currentUserId = null
  )
  {
    IJournal[] allJournals = await _repository.GetAllJournals(
      searchText,
      scheduleMode,
      journalTypes,
      journalIds,
      limit,
      currentUserId
    );

    return allJournals
      .Where(j => j.UserId == CurrentUser.Value.Id)
      .ToArray();
  }

  public async Task<IJournal?> GetJournal(string journalId)
  {
    IJournal? journal = await _repository.GetJournal(journalId);
    return journal?.UserId == CurrentUser.Value.Id ? journal : null;
  }

  public async Task<IEntry[]> GetEntriesForJournal(
    string journalId,
    DateTime? fromDate,
    DateTime? toDate,
    IDictionary<string, string[]>? attributeValues,
    string? searchText
  )
  {
    return (await _repository.GetEntriesForJournal(journalId, fromDate, toDate, attributeValues, searchText))
      .Where(m => m.UserId == CurrentUser.Value.Id)
      .ToArray();
  }

  public Task<IEntry[]> SearchEntries(
    string? searchText,
    ScheduleMode? scheduleMode = null,
    JournalType[]? journalTypes = null,
    string[]? journalIds = null,
    int? limit = null,
    string? currentUserId = null,
    bool onlyConsiderTitle = false
  )
  {
    return _repository.SearchEntries(
      searchText,
      scheduleMode,
      journalTypes,
      journalIds,
      limit,
      CurrentUser.Value.Id
    );
  }

  public Task<UpsertResult> UpsertJournal(IJournal journal)
  {
    journal.UserId = CurrentUser.Value.Id;
    return _repository.UpsertJournal(journal);
  }

  public async Task DeleteJournal(string journalId)
  {
    // get journal only returns if journal belongs to current user
    IJournal? journal = await GetJournal(journalId);

    if (journal == null)
    {
      return;
    }

    await _repository.DeleteJournal(journalId);
  }

  public async Task ModifyJournalPermissions(string journalId, Dictionary<string, PermissionKind> permissions)
  {
    IJournal? journal = await GetJournal(journalId);
    if (journal == null)
    {
      throw new Exception("Does not exist or no access");
    }

    await _repository.ModifyJournalPermissions(journalId, permissions);
  }

  public Task<UpsertResult> UpsertEntry<TEntry>(TEntry entry) where TEntry : IEntry
  {
    entry.UserId = CurrentUser.Value.Id;
    return _repository.UpsertEntry(entry);
  }

  public async Task DeleteEntry(string entryId)
  {
    // get entry only returns if entry belongs to current user
    IEntry? entry = await GetEntry(entryId);

    if (entry == null)
    {
      return;
    }

    await _repository.DeleteEntry(entryId);
  }

  public async Task<IEntry?> GetEntry(string entryId)
  {
    IEntry? entry = await _repository.GetEntry(entryId);

    return entry != null && entry.UserId == CurrentUser.Value.Id
      ? entry
      : null;
  }

  public Task WakeMeUp()
  {
    return Task.CompletedTask;
  }

  public Task<long> CountAllUsers()
  {
    return _repository.CountAllUsers();
  }

  public Task<long> CountAllEntries()
  {
    return _repository.CountAllEntries();
  }

  public Task<long> CountAllJournals()
  {
    return _repository.CountAllJournals();
  }

  private IUser LoadUser()
  {
    var name = _currentUserService.GetUserName();
    EnsureUserNameIsSet(name);

    IUser? result = _repository.GetUser(name!).Result;
    if (result == null)
    {
      throw new NotAllowedOperationException($"Current user '{name}' does not exist.");
    }

    return result;
  }

  private static void EnsureUserNameIsSet(string? name)
  {
    if (string.IsNullOrEmpty(name))
    {
      throw new NotAllowedOperationException("Current user is not available.");
    }
  }
}
