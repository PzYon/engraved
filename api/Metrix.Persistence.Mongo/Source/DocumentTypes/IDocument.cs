using MongoDB.Bson;

namespace Metrix.Persistence.Mongo.DocumentTypes;

public interface IDocument
{
  public ObjectId Id { get; set; }
}
