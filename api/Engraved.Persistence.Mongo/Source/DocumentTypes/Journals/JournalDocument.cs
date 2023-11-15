using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace Engraved.Persistence.Mongo.DocumentTypes.Journals;

public abstract class JournalDocument : IUserScopedDocument, IHasPermissionsDocument
{
  [BsonId(IdGenerator = typeof(GuidGenerator))]
  [BsonRepresentation(BsonType.ObjectId)]
  [BsonIgnoreIfDefault]
  public ObjectId Id { get; set; }

  public string? UserId { get; set; }

  public string? Name { get; set; }

  public string? Description { get; set; }

  public string? Notes { get; set; }

  public abstract JournalType Type { get; }

  public Dictionary<string, JournalAttribute> Attributes { get; set; } = new();

  public Dictionary<string, Dictionary<string, double>> Thresholds { get; set; } = new();

  public DateTime? EditedOn { get; set; }

  public UserPermissions Permissions { get; set; } = new();

  public Dictionary<string, string> CustomProps { get; set; } = new();
}
