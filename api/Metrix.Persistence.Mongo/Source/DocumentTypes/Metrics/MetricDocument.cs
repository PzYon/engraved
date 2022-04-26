using Metrix.Core.Domain.Metrics;
using MongoDB.Bson;

namespace Metrix.Persistence.Mongo.DocumentTypes.Metrics;

public abstract class BaseMetricDocument : IMetricDocument
{
  public ObjectId Id { get; set; }

  public string Key { get; set; } = null!;

  public string Name { get; set; } = null!;

  public string? Description { get; set; }

  public abstract MetricType Type { get; }

  public Dictionary<string, string> Flags { get; set; } = new();

  public DateTime? LastMeasurementDate { get; set; }
}
