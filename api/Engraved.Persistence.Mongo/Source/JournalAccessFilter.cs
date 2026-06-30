using Engraved.Core.Domain.Permissions;
using Engraved.Persistence.Mongo.DocumentTypes;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo;

// This mirrors the in-memory rule in JournalAccessPolicy
public static class JournalAccessFilter
{
  public static FilterDefinition<TDocument> ForUser<TDocument>(string? userId, PermissionKind kind)
    where TDocument : IDocument
  {
    var ownerFilter =
      Builders<TDocument>.Filter.Eq(nameof(IUserOwnedDocument.UserId), userId);

    if (!typeof(TDocument).IsAssignableTo(typeof(IHasPermissionsDocument)))
    {
      return ownerFilter;
    }

    var permissionFilter = Builders<TDocument>.Filter.Gte(
      string.Join(".", nameof(IHasPermissionsDocument.Permissions), userId, nameof(PermissionDefinition.Kind)),
      kind
    );

    return Builders<TDocument>.Filter.Or(ownerFilter, permissionFilter);
  }
}
