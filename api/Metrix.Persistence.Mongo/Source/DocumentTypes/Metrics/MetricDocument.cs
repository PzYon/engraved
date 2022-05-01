using Metrix.Core.Domain.Metrics;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace Metrix.Persistence.Mongo.DocumentTypes.Metrics;

public abstract class MetricDocument
{
  [BsonId(IdGenerator = typeof(GuidGenerator))]
  [BsonRepresentation(BsonType.ObjectId)]
  [BsonIgnoreIfDefault]
  public ObjectId Id { get; set; }

  public string Name { get; set; }

  public string? Description { get; set; }

  public abstract MetricType Type { get; }

  public Dictionary<string, string> Flags { get; set; }

  public DateTime? LastMeasurementDate { get; set; }
}
