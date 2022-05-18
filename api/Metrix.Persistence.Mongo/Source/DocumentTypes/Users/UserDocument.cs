using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace Metrix.Persistence.Mongo.DocumentTypes.Users;

public class UserDocument : IDocument
{
  public string? Name { get; set; }

  public string? ImageUrl { get; set; }

  [BsonId(IdGenerator = typeof(GuidGenerator))]
  [BsonRepresentation(BsonType.ObjectId)]
  [BsonIgnoreIfDefault]
  public ObjectId Id { get; set; }
}
