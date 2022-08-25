using Metrix.Persistence.Mongo.DocumentTypes;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Metrix.Persistence.Mongo;

public static class MongoUtil
{
  public static FilterDefinition<TDocument> GetAllDocumentsFilter<TDocument>()
    where TDocument : IDocument
  {
    return Builders<TDocument>.Filter.Empty;
  }

  public static FilterDefinition<TDocument> GetDocumentByIdFilter<TDocument>(string? documentId)
  {
    return Builders<TDocument>.Filter.Eq(nameof(IDocument.Id), EnsureObjectId(documentId));
  }

  public static string GenerateNewIdAsString()
  {
    return GenerateNewId().ToString();
  }

  private static ObjectId EnsureObjectId(string? id)
  {
    return string.IsNullOrEmpty(id)
      ? GenerateNewId()
      : ParseObjectId(id);
  }

  private static ObjectId GenerateNewId()
  {
    return ObjectId.GenerateNewId();
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
