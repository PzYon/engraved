using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.User;
using Engraved.Persistence.Mongo.DocumentTypes;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo;

public class UserScopedMongoRepository : MongoRepository, IUserScopedRepository
{
  private readonly ICurrentUserService _currentUserService;

  public Lazy<IUser> CurrentUser { get; }

  public UserScopedMongoRepository(
    MongoDatabaseClient client,
    ICurrentUserService currentUserService
  )
    : base(client)
  {
    _currentUserService = currentUserService;
    CurrentUser = new Lazy<IUser>(LoadUser);
  }

  public override async Task<UpsertResult> UpsertUser(IUser user)
  {
    EnsureEntityBelongsToUser(user.Id);
    return await base.UpsertUser(user);
  }

  public override async Task<UpsertResult> UpsertJournal(IJournal journal)
  {
    EnsureUserId(journal);
    await EnsureUserHasPermission(journal.Id, PermissionKind.Write);
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

  protected override FilterDefinition<TDocument> GetAllJournalDocumentsFilter<TDocument>(PermissionKind kind)
  {
    string? userId = CurrentUser.Value.Id;
    EnsureUserIsSet(userId);

    // for current user we do not care which PermissionKind is requested, as if user
    // is owner, then everything is allowed.
    FilterDefinition<TDocument> currentUserFilter = GetCurrentUserFilter<TDocument>(userId);

    if (typeof(TDocument).IsAssignableTo(typeof(IHasPermissionsDocument)))
    {
      return Builders<TDocument>.Filter.Or(currentUserFilter, GetHasPermissionsFilter<TDocument>(userId, kind));
    }

    return currentUserFilter;
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
    string? name = _currentUserService.GetUserName();
    EnsureUserIsSet(name);

    IUser? result = base.GetUser(name).Result;
    if (result == null)
    {
      throw new NotAllowedOperationException($"Current user '{name}' does not exist.");
    }

    return result;
  }

  private void EnsureUserId(IUserScoped entity)
  {
    if (string.IsNullOrEmpty(entity.UserId))
    {
      entity.UserId = CurrentUser.Value.Id;
    }
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
      throw new NotAllowedOperationException($"Current user is not available.");
    }
  }
}
