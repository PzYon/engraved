using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;
using Engraved.Persistence.Mongo.DocumentTypes;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo;

public class UserScopedMongoRepository : MongoRepository, IUserScopedRepository
{
  private readonly ICurrentUserService _currentUserService;

  public Lazy<IUser> CurrentUser { get; }

  public UserScopedMongoRepository(
    MongoDatabaseClient mongoDatabaseClient,
    ICurrentUserService currentUserService
  )
    : base(mongoDatabaseClient)
  {
    _currentUserService = currentUserService;
    CurrentUser = new Lazy<IUser>(LoadUser);
  }

  public override async Task<UpsertResult> UpsertUser(IUser user)
  {
    EnsureEntityBelongsToUser(user.Id);
    return await base.UpsertUser(user);
  }

  private bool _ignorePermissionsForJournalIdFilter;

  public override async Task<UpsertResult> UpsertJournal(IJournal journal)
  {
    if (!string.IsNullOrEmpty(journal.Id))
    {
      IJournal? existingJournal;
      try
      {
        _ignorePermissionsForJournalIdFilter = true;
        existingJournal = await base.GetJournal(journal.Id, PermissionKind.None);
      }
      finally
      {
        _ignorePermissionsForJournalIdFilter = false;
      }

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

  protected override FilterDefinition<TDocument> GetAllJournalDocumentsFilter<TDocument>(PermissionKind kind)
  {
    if (_ignorePermissionsForJournalIdFilter)
    {
      return MongoUtil.GetAllDocumentsFilter<TDocument>();
    }

    string? userId = CurrentUser.Value.Id;
    EnsureUserIsSet(userId);

    // for current user we do not care which PermissionKind is requested, as if user
    // is owner, then everything is allowed.
    FilterDefinition<TDocument> currentUserFilter = GetCurrentUserFilter<TDocument>(userId);

    if (!typeof(TDocument).IsAssignableTo(typeof(IHasPermissionsDocument)))
    {
      return currentUserFilter;
    }

    return Builders<TDocument>.Filter.Or(currentUserFilter, GetHasPermissionsFilter<TDocument>(userId, kind));
  }

  private static FilterDefinition<TDocument> GetHasPermissionsFilter<TDocument>(
    string? userId,
    PermissionKind permissionKind
  )
  {
    return Builders<TDocument>.Filter.Gte(
      string.Join(".", nameof(IHasPermissionsDocument.Permissions), userId, nameof(PermissionDefinition.Kind)),
      permissionKind
    );
  }

  private static FilterDefinition<TDocument> GetCurrentUserFilter<TDocument>(string? userId)
  {
    return Builders<TDocument>.Filter.Eq(nameof(IUserScopedDocument.UserId), userId);
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

  private async Task EnsureUserHasPermission(string? journalId, PermissionKind kind)
  {
    if (string.IsNullOrEmpty(journalId))
    {
      return;
    }

    IJournal? journal = await GetJournal(journalId, kind);
    if (journal == null)
    {
      throw new NotAllowedOperationException("Journal doesn't exist or you do not have permissions.");
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
