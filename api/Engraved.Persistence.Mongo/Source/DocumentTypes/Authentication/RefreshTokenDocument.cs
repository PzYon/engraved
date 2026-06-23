using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace Engraved.Persistence.Mongo.DocumentTypes.Authentication;

public class RefreshTokenDocument : IDocument
{
  [BsonId(IdGenerator = typeof(GuidGenerator))]
  [BsonRepresentation(BsonType.ObjectId)]
  [BsonIgnoreIfDefault]
  public ObjectId Id { get; set; }

  public string UserId { get; set; } = null!;

  public string TokenHash { get; set; } = null!;

  public DateTime ExpiresAt { get; set; }

  public DateTime CreatedOn { get; set; }
}
