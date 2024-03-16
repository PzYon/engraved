using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace Engraved.Persistence.Mongo.DocumentTypes.Entries;

public abstract class EntryDocument : IUserScopedDocument, IScheduledDocument
{
  [BsonId(IdGenerator = typeof(GuidGenerator))]
  [BsonRepresentation(BsonType.ObjectId)]
  [BsonIgnoreIfDefault]
  public ObjectId Id { get; set; }

  public string? UserId { get; set; }

  public string ParentId { get; set; } = null!;

  public string? Notes { get; set; }

  public DateTime? DateTime { get; set; }

  public DateTime? EditedOn { get; set; }

  public Dictionary<string, string[]> JournalAttributeValues { get; set; } = new();

  [Obsolete]
  public ScheduleSubDocument? Schedule { get; set; }
  
  public Dictionary<string, ScheduleSubDocument> Schedules { get; set; } = new();
}
