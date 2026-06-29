using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Domain.Permissions;

// The persistence layer mirrors this exact rule as a MongoDB query filter
// (Engraved.Persistence.Mongo.JournalAccessFilter) for read-shaping. 
public static class JournalAccessPolicy
{
  public static bool HasAccess(IJournal? journal, string? userId, PermissionKind required)
  {
    if (string.IsNullOrEmpty(userId))
    {
      return false;
    }

    if (journal == null)
    {
      return false;
    }

    // the owner has full access, regardless of the required kind
    if (journal.UserId == userId)
    {
      return true;
    }

    return journal.Permissions.TryGetValue(userId, out PermissionDefinition? definition)
           && definition.Kind >= required;
  }
}
