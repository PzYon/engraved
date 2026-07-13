using Engraved.Core.Domain.Permissions;
using Engraved.Persistence.Mongo.DocumentTypes;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo.Scoping;

// Read-scoping strategy: shapes journal/entry reads to what the caller may see. Injected into the
// repositories instead of being baked in via inheritance, so the effective scope of a repository is
// visible at construction time:
//  - UnrestrictedReadScope: everything is visible (system jobs, login, health)
//  - UserReadScope: only what the current user owns or has been granted permission on
public interface IReadScope
{
  FilterDefinition<TDocument> GetFilter<TDocument>(PermissionKind kind)
    where TDocument : IDocument;
}
