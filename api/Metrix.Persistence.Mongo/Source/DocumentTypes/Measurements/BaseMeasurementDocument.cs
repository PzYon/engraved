using MongoDB.Bson;

namespace Metrix.Persistence.Mongo.DocumentTypes.Measurements;

public abstract class BaseMeasurementDocument : IMeasurementDocument
{
  public ObjectId Id { get; set; }

  public string MetricKey { get; set; } = null!;
  
  public string? Notes { get; set; }
  
  public DateTime? DateTime { get; set; }
  
  public string? MetricFlagKey { get; set; }
}
