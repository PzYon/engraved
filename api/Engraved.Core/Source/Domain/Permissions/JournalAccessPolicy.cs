using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Domain.Permissions;

/// <summary>
/// The single source of truth for "may this user access this journal at the required level".
///
/// The rule: the owner always has full access; otherwise the user needs an explicit permission
/// whose kind is at least the required kind. <see cref="PermissionKind"/> is treated ordinally
/// (None &lt; Read &lt; Write).
///
/// The persistence layer mirrors this exact rule as a MongoDB query filter
/// (Engraved.Persistence.Mongo.JournalAccessFilter) for read-shaping. A cross-check test pins that
/// the in-memory predicate and the query filter agree, so the two forms cannot drift apart.
/// </summary>
public static class JournalAccessPolicy
{
  public static bool HasAccess(IJournal journal, string? userId, PermissionKind required)
  {
    if (string.IsNullOrEmpty(userId))
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
