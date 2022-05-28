using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace Metrix.Persistence.Mongo.DocumentTypes.Measurements;

public abstract class MeasurementDocument : IUserScopedDocument
{
  [BsonId(IdGenerator = typeof(GuidGenerator))]
  [BsonRepresentation(BsonType.ObjectId)]
  [BsonIgnoreIfDefault]
  public ObjectId Id { get; set; }

  public string? UserId { get; set; }

  public string MetricId { get; set; } = null!;

  public string? Notes { get; set; }

  public DateTime? DateTime { get; set; }

  public Dictionary<string, string[]> MetricFlagKeys { get; set; } = new();
}
