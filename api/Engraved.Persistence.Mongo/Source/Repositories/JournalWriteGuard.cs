using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;

namespace Engraved.Persistence.Mongo.Repositories;

// Write-guard mechanism shared by the user-restricted repository decorators: load the journal
// without scoping, then apply the permission rule in memory via JournalAccessPolicy. Reads
// (UserReadScope) and writes (here) therefore enforce one shared rule (JournalAccessPolicy /
// JournalAccessFilter).
public class JournalWriteGuard(MongoJournalRepository journalRepository, Lazy<IUser> currentUser)
{
  public async Task EnsureUserHasWritePermission(string? journalId)
  {
    if (!string.IsNullOrEmpty(journalId))
    {
      IJournal? journal = await journalRepository.GetJournalUnscoped(journalId);
      if (JournalAccessPolicy.HasAccess(journal, currentUser.Value.Id, PermissionKind.Write))
      {
        return;
      }
    }

    throw new NotAllowedOperationException("Journal doesn't exist or you do not have permissions.");
  }

  public void EnsureUserId(IUserOwned entity)
  {
    if (string.IsNullOrEmpty(entity.UserId))
    {
      entity.UserId = currentUser.Value.Id;
    }

    EnsureEntityBelongsToUser(entity.UserId);
  }

  public void EnsureEntityBelongsToUser(string? entityUserId)
  {
    if (entityUserId != currentUser.Value.Id)
    {
      throw new NotAllowedOperationException("Entity does not belong to current user.");
    }
  }
}
