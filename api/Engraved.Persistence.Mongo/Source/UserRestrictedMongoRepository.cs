using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;
using Engraved.Persistence.Mongo.Repositories;
using Engraved.Persistence.Mongo.Scoping;

namespace Engraved.Persistence.Mongo;

// Permission/owner-filtered access for the current user. Reads are shaped by the injected
// UserReadScope; writes are guarded here by loading the journal unscoped and applying the same rule
// in memory. Both mechanisms enforce one shared rule (JournalAccessPolicy / JournalAccessFilter).
public class UserRestrictedMongoRepository : MongoRepositoryBase, IUserRestrictedRepository
{
  public UserRestrictedMongoRepository(
    MongoDatabaseClient mongoDatabaseClient,
    ICurrentUserService currentUserService
  )
    : this(mongoDatabaseClient, CreateCurrentUserLazy(mongoDatabaseClient, currentUserService))
  {
  }

  private UserRestrictedMongoRepository(MongoDatabaseClient mongoDatabaseClient, Lazy<IUser> currentUser)
    : base(mongoDatabaseClient, new UserReadScope(currentUser))
  {
    CurrentUser = currentUser;
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
      IJournal? existingJournal = await GetJournalUnscoped(journal.Id);

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

  private static Lazy<IUser> CreateCurrentUserLazy(
    MongoDatabaseClient mongoDatabaseClient,
    ICurrentUserService currentUserService
  )
  {
    var userRepository = new MongoUserRepository(mongoDatabaseClient);

    return new Lazy<IUser>(() =>
      {
        IUser user = currentUserService.LoadUser().Result;
        EnsureUserIsSet(user.Name);

        IUser? dbUser = userRepository.GetUser(user.Id ?? user.Name).Result;
        return dbUser ?? user;
      }
    );
  }

  private void EnsureUserId(IUserOwned entity)
  {
    if (string.IsNullOrEmpty(entity.UserId))
    {
      entity.UserId = CurrentUser.Value.Id;
    }

    EnsureEntityBelongsToUser(entity.UserId);
  }

  // Write-guard mechanism: load the journal without scoping, then apply the same rule in memory via
  // JournalAccessPolicy. Reads (UserReadScope) and writes (here) therefore enforce one shared rule.
  private async Task EnsureUserHasPermission(string? journalId, PermissionKind kind)
  {
    if (!string.IsNullOrEmpty(journalId))
    {
      IJournal? journal = await GetJournalUnscoped(journalId);
      if (JournalAccessPolicy.HasAccess(journal, CurrentUser.Value.Id, kind))
      {
        return;
      }
    }

    throw new NotAllowedOperationException("Journal doesn't exist or you do not have permissions.");
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
