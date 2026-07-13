using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;
using Engraved.Persistence.Mongo.DocumentTypes;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo.Scoping;

// Restricts reads to what the current user owns or has been granted permission on. The actual rule
// lives in JournalAccessFilter (the query form of JournalAccessPolicy).
public class UserReadScope(Lazy<IUser> currentUser) : IReadScope
{
  public FilterDefinition<TDocument> GetFilter<TDocument>(PermissionKind kind)
    where TDocument : IDocument
  {
    var userId = currentUser.Value.Id;
    if (string.IsNullOrEmpty(userId))
    {
      throw new NotAllowedOperationException("Current user is not available.");
    }

    return JournalAccessFilter.ForUser<TDocument>(userId, kind);
  }
}
