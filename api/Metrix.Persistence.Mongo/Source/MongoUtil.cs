using Metrix.Persistence.Mongo.DocumentTypes;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Metrix.Persistence.Mongo;

public static class MongoUtil
{
  internal static FilterDefinition<TDocument> GetAllDocumentsFilter<TDocument>()
    where TDocument : IDocument
  {
    return Builders<TDocument>.Filter.Empty;
  }

  internal static FilterDefinition<TDocument> GetDocumentByIdFilter<TDocument>(string? documentId)
  {
    return Builders<TDocument>.Filter.Eq(nameof(IDocument.Id), EnsureObjectId(documentId));
  }

  private static ObjectId EnsureObjectId(string? id)
  {
    return string.IsNullOrEmpty(id)
      ? ObjectId.GenerateNewId()
      : ParseObjectId(id);
  }

  private static ObjectId ParseObjectId(string id)
  {
    if (ObjectId.TryParse(id, out ObjectId objectId))
    {
      return objectId;
    }

    throw new ArgumentOutOfRangeException(nameof(id), $"\"{id}\" is not a valid ID.");
  }
}
 