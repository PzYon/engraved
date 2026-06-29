using Engraved.Core.Domain.Permissions;
using Engraved.Persistence.Mongo.DocumentTypes;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo;

/// <summary>
/// The MongoDB query form of <see cref="JournalAccessPolicy"/>. Restricts a document query to the
/// rows the given user may access at the required permission kind: documents they own, OR — for
/// permission-holding documents — where their permission kind is &gt;= the required kind.
///
/// This mirrors the in-memory rule in <see cref="JournalAccessPolicy"/>; the two are pinned to
/// agree by JournalAccessFilter_Matches_JournalAccessPolicy_Should.
/// </summary>
public static class JournalAccessFilter
{
  public static FilterDefinition<TDocument> ForUser<TDocument>(string? userId, PermissionKind kind)
    where TDocument : IDocument
  {
    // owner check applies to every user-scoped document; for the owner the requested kind is
    // irrelevant, as owning the document implies full access.
    FilterDefinition<TDocument> ownerFilter =
      Builders<TDocument>.Filter.Eq(nameof(IUserScopedDocument.UserId), userId);

    if (!typeof(TDocument).IsAssignableTo(typeof(IHasPermissionsDocument)))
    {
      return ownerFilter;
    }

    FilterDefinition<TDocument> permissionFilter = Builders<TDocument>.Filter.Gte(
      string.Join(".", nameof(IHasPermissionsDocument.Permissions), userId, nameof(PermissionDefinition.Kind)),
      kind
    );

    return Builders<TDocument>.Filter.Or(ownerFilter, permissionFilter);
  }
}
