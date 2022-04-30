using MongoDB.Bson;

namespace Metrix.Persistence.Mongo.DocumentTypes.Measurements;

public abstract class MeasurementDocument
{
  public ObjectId? Id { get; set; }

  public string MetricKey { get; set; }

  public string? Notes { get; set; }

  public DateTime? DateTime { get; set; }

  public string? MetricFlagKey { get; set; }
}
