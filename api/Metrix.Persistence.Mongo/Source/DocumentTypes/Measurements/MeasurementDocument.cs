using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace Metrix.Persistence.Mongo.DocumentTypes.Measurements;

public abstract class MeasurementDocument
{
  [BsonId(IdGenerator = typeof(GuidGenerator))]
  [BsonRepresentation(BsonType.ObjectId)]
  [BsonIgnoreIfDefault]
  public ObjectId Id { get; set; }

  public string MetricId { get; set; }

  public string? Notes { get; set; }

  public DateTime? DateTime { get; set; }

  public string? MetricFlagKey { get; set; }
}
