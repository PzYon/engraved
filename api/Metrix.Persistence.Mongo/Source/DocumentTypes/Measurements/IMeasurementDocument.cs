using MongoDB.Bson;

namespace Metrix.Persistence.Mongo.DocumentTypes.Measurements;

public interface IMeasurementDocument
{
  ObjectId Id { get; set; }

  string MetricKey { get; set; }

  string? Notes { get; set; }

  DateTime? DateTime { get; set; }

  string? MetricFlagKey { get; set; }
}
