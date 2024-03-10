using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace Engraved.Persistence.Mongo.DocumentTypes.Users;

public class UserDocument : IDocument
{
  [BsonId(IdGenerator = typeof(GuidGenerator))]
  [BsonRepresentation(BsonType.ObjectId)]
  [BsonIgnoreIfDefault]
  public ObjectId Id { get; set; }

  public Guid? GlobalUniqueId { get; set; }
  
  public string? Name { get; set; }

  public string? DisplayName { get; set; }

  public string? ImageUrl { get; set; }

  public DateTime? LastLoginDate { get; set; }

  public List<string> FavoriteJournalIds { get; set; } = new();
}
