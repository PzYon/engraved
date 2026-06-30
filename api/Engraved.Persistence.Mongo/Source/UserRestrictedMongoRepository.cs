using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo;

// Permission/owner-filtered access for the current user. Adds the read-shaping filter and the write
// guards on top of the shared MongoRepositoryBase, and exposes the CurrentUser the scoping is based
// on. Both mechanisms enforce one shared rule (JournalAccessPolicy / JournalAccessFilter).
public class UserRestrictedMongoRepository : MongoRepositoryBase, IUserRestrictedRepository
{
  private readonly ICurrentUserService _currentUserService;

  private bool _ignorePermissionsForJournalIdFilter;

  public UserRestrictedMongoRepository(
    MongoDatabaseClient mongoDatabaseClient,
    ICurrentUserService currentUserService
  )
    : base(mongoDatabaseClient)
  {
    _currentUserService = currentUserService;
    CurrentUser = new Lazy<IUser>(LoadUser);
  }

  public Lazy<IUser> CurrentUser { get; }

  public override async Task<UpsertResult> UpsertUser(IUser user)
  {
    EnsureEntityBelongsToUser(user.Id);
    return await base.UpsertUser(user);
  }

  public override async Task<UpsertResult> UpsertJournal(IJournal journal)
  {
    if (!string.IsNullOrEmpty(journal.Id))
    {
      IJournal? existingJournal = await LoadJournalIgnoringPermissions(journal.Id);

      if (existingJournal != null)
      {
        await EnsureUserHasPermission(journal.Id, PermissionKind.Write);

        // ensure we don't accidentally change the owner if it's an update
        journal.UserId = existingJournal.UserId;
        return await base.UpsertJournal(journal);
      }
    }

    EnsureUserId(journal);

    return await base.UpsertJournal(journal);
  }

  public override async Task<UpsertResult> UpsertEntry<TEntry>(TEntry entry)
  {
    EnsureUserId(entry);
    await EnsureUserHasPermission(entry.ParentId, PermissionKind.Write);
    return await base.UpsertEntry(entry);
  }

  public override async Task DeleteJournal(string journalId)
  {
    await EnsureUserHasPermission(journalId, PermissionKind.Write);
    await base.DeleteJournal(journalId);
  }

  public override async Task DeleteEntry(string entryId)
  {
    IEntry? entry = await GetEntry(entryId);
    if (entry == null)
    {
      return;
    }

    await EnsureUserHasPermission(entry.ParentId, PermissionKind.Write);
    await base.DeleteEntry(entryId);
  }

  // Read-shaping mechanism: restrict journal/entry queries to what the current user may read.
  // The actual rule lives in JournalAccessFilter (the query form of JournalAccessPolicy).
  protected override FilterDefinition<TDocument> GetAllJournalDocumentsFilter<TDocument>(PermissionKind kind)
  {
    if (_ignorePermissionsForJournalIdFilter)
    {
      return MongoUtil.GetAllDocumentsFilter<TDocument>();
    }

    var userId = CurrentUser.Value.Id;
    EnsureUserIsSet(userId);

    return JournalAccessFilter.ForUser<TDocument>(userId, kind);
  }

  private IUser LoadUser()
  {
    IUser result = _currentUserService.LoadUser().Result;
    EnsureUserIsSet(result.Name);

    IUser? dbUser = base.GetUser(result.Id ?? result.Name).Result;
    return dbUser ?? result;
  }

  private void EnsureUserId(IUserScoped entity)
  {
    if (string.IsNullOrEmpty(entity.UserId))
    {
      entity.UserId = CurrentUser.Value.Id;
    }

    EnsureEntityBelongsToUser(entity.UserId);
  }

  // Write-guard mechanism: load the journal without scoping, then apply the same rule in memory via
  // JournalAccessPolicy. Reads (above) and writes (here) therefore enforce one shared rule.
  private async Task EnsureUserHasPermission(string? journalId, PermissionKind kind)
  {
    if (!string.IsNullOrEmpty(journalId))
    {
      IJournal? journal = await LoadJournalIgnoringPermissions(journalId);
      if (JournalAccessPolicy.HasAccess(journal, CurrentUser.Value.Id, kind))
      {
        return;
      }
    }

    throw new NotAllowedOperationException("Journal doesn't exist or you do not have permissions.");
  }

  // Loads a journal bypassing the read-scoping filter, so callers can apply the permission rule
  // themselves (the write guard) or read the owner of a journal they are about to update.
  private async Task<IJournal?> LoadJournalIgnoringPermissions(string journalId)
  {
    try
    {
      _ignorePermissionsForJournalIdFilter = true;
      return await GetJournal(journalId, PermissionKind.None);
    }
    finally
    {
      _ignorePermissionsForJournalIdFilter = false;
    }
  }

  private void EnsureEntityBelongsToUser(string? entityUserId)
  {
    if (entityUserId != CurrentUser.Value.Id)
    {
      throw new NotAllowedOperationException("Entity does not belong to current user.");
    }
  }

  private static void EnsureUserIsSet(string? nameOrId)
  {
    if (string.IsNullOrEmpty(nameOrId))
    {
      throw new NotAllowedOperationException("Current user is not available.");
    }
  }
}
