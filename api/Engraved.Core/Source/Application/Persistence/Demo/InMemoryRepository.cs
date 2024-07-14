﻿using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Persistence.Demo;

public class InMemoryRepository : IRepository
{
  public List<IUser> Users { get; } = new();

  public List<IEntry> Entries { get; } = new();

  public List<IJournal> Journals { get; } = new();

  public Task<IUser?> GetUser(string nameOrId)
  {
    return Task.FromResult(Users.FirstOrDefault(u => u.Name == nameOrId));
  }

  public Task<UpsertResult> UpsertUser(IUser user)
  {
    if (string.IsNullOrEmpty(user.Id))
    {
      user.Id = GenerateId();
    }
    else
    {
      RemoveUser(user);
    }

    Users.Add(user.Copy());

    return Task.FromResult(new UpsertResult { EntityId = user.Id });
  }

  public async Task<IUser[]> GetUsers(string[] userIds)
  {
    IUser[] allUsers = await GetAllUsers();
    return allUsers.Where(u => userIds.Contains(u.Id)).ToArray();
  }

  public Task<IUser[]> GetAllUsers()
  {
    return Task.FromResult(Users.Select(u => u.Copy()).ToArray());
  }

  public Task<IJournal[]> GetAllJournals(
    string? searchText = null,
    ScheduleMode? scheduleMode = null,
    JournalType[]? journalTypes = null,
    string[]? journalIds = null,
    int? limit = null,
    string? currentUserId = null
  )
  {
    // note: conditions are currently partially ignored, as they are not (yet?) needed for these in memory tests.
    return Task.FromResult(
      Journals.Where(j => string.IsNullOrEmpty(searchText) || j.Name.Contains(searchText))
        .ToArray()
    );
  }

  public Task<IJournal?> GetJournal(string journalId)
  {
    return Task.FromResult(Journals.FirstOrDefault(m => m.Id == journalId).Copy());
  }

  public Task<IEntry[]> GetEntriesForJournal(
    string journalId,
    DateTime? fromDate = null,
    DateTime? toDate = null,
    IDictionary<string, string[]>? attributeValues = null,
    string? searchText = null
  )
  {
    return Task.FromResult(
      Entries.Where(m => m.ParentId == journalId)
        .Select(m => m.Copy())
        .ToArray()
    );
  }

  public Task<IEntry[]> SearchEntries(
    string? searchText,
    ScheduleMode? scheduleMode = null,
    JournalType[]? journalTypes = null,
    string[]? journalIds = null,
    int? limit = null,
    string? currentUserId = null
  )
  {
    return Task.FromResult(
      Entries.OrderByDescending(m => m.DateTime)
        .Where(m => (journalIds ?? Enumerable.Empty<string>()).Contains(m.ParentId))
        .Where(
          m =>
          {
            if (!string.IsNullOrEmpty(searchText))
            {
              return !string.IsNullOrEmpty(m.Notes) && m.Notes.Contains(searchText);
            }

            return true;
          }
        )
        .Take(limit ?? 100)
        .ToArray()
    );
  }

  public Task<UpsertResult> UpsertJournal(IJournal journal)
  {
    if (string.IsNullOrEmpty(journal.Id))
    {
      journal.Id = GenerateId();
    }
    else
    {
      RemoveJournal(journal);
    }

    Journals.Add(journal.Copy());

    return Task.FromResult(new UpsertResult { EntityId = journal.Id });
  }

  public async Task DeleteJournal(string journalId)
  {
    if (string.IsNullOrEmpty(journalId))
    {
      return;
    }

    IJournal? journal = await GetJournal(journalId);
    if (journal == null)
    {
      return;
    }

    Journals.Remove(journal);
  }

  public async Task ModifyJournalPermissions(string journalId, Dictionary<string, PermissionKind> permissions)
  {
    IJournal? journal = await GetJournal(journalId);
    if (journal == null)
    {
      return;
    }

    var permissionsEnsurer = new PermissionsEnsurer(this, UpsertUser);
    await permissionsEnsurer.EnsurePermissions(journal, permissions);

    await UpsertJournal(journal);
  }

  public async Task<UpsertResult> UpsertEntry<TEntry>(TEntry entry)
    where TEntry : IEntry
  {
    if (string.IsNullOrEmpty(entry.Id))
    {
      entry.Id = GenerateId();
    }
    else
    {
      await DeleteEntry(entry.Id);
    }

    Entries.Add(entry.Copy());

    return new UpsertResult { EntityId = entry.Id };
  }

  public async Task DeleteEntry(string entryId)
  {
    if (string.IsNullOrEmpty(entryId))
    {
      return;
    }

    IEntry? entry = await GetEntry(entryId);
    if (entry == null)
    {
      return;
    }

    Entries.Remove(entry);
  }

  public Task<IEntry?> GetEntry(string entryId)
  {
    return Task.FromResult(Entries.FirstOrDefault(m => m.Id == entryId));
  }

  public Task WakeMeUp()
  {
    return Task.CompletedTask;
  }

  public Task<long> CountAllUsers()
  {
    return Task.FromResult(Convert.ToInt64(Users.Count));
  }

  public Task<long> CountAllEntries()
  {
    return Task.FromResult(Convert.ToInt64(Entries.Count));
  }

  public Task<long> CountAllJournals()
  {
    return Task.FromResult(Convert.ToInt64(Journals.Count));
  }

  private void RemoveJournal<TJournal>(TJournal journal) where TJournal : IJournal
  {
    if (string.IsNullOrEmpty(journal.Id))
    {
      return;
    }

    IJournal? firstOrDefault = Journals.FirstOrDefault(j => j.Id == journal.Id);
    if (firstOrDefault == null)
    {
      return;
    }

    Journals.Remove(firstOrDefault);
  }

  private void RemoveUser(IUser user)
  {
    if (string.IsNullOrEmpty(user.Name))
    {
      return;
    }

    IUser? firstOrDefault = Users.FirstOrDefault(m => m.Name == user.Name);
    if (firstOrDefault == null)
    {
      return;
    }

    Users.Remove(firstOrDefault);
  }

  private static string GenerateId()
  {
    return Guid.NewGuid().ToString("N");
  }
}
