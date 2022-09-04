using Metrix.Core.Domain.Metrics;
using Metrix.Core.Domain.Permissions;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace Metrix.Persistence.Mongo.DocumentTypes.Metrics;

public abstract class MetricDocument : IUserScopedDocument, IHasPerissionsDocument
{
  [BsonId(IdGenerator = typeof(GuidGenerator))]
  [BsonRepresentation(BsonType.ObjectId)]
  [BsonIgnoreIfDefault]
  public ObjectId Id { get; set; }

  public string? UserId { get; set; }

  public string? Name { get; set; }

  public string? Description { get; set; }

  public string? Notes { get; set; }

  public abstract MetricType Type { get; }

  public Dictionary<string, MetricAttribute> Attributes { get; set; } = new();

  public DateTime? LastMeasurementDate { get; set; }

  public UserPermissions Permissions { get; set; } = new();
}
