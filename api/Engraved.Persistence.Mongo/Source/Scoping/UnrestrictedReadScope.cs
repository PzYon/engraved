using Engraved.Core.Domain.Permissions;
using Engraved.Persistence.Mongo.DocumentTypes;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo.Scoping;

// No scoping: every document is visible regardless of the requested permission kind.
public class UnrestrictedReadScope : IReadScope
{
  public static readonly UnrestrictedReadScope Instance = new();

  public FilterDefinition<TDocument> GetFilter<TDocument>(PermissionKind kind)
    where TDocument : IDocument
  {
    return MongoUtil.GetAllDocumentsFilter<TDocument>();
  }
}
