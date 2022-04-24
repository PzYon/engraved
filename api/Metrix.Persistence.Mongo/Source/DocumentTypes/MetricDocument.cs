using Metrix.Core.Domain.Metrics;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Metrix.Persistence.Mongo.DocumentTypes;

public abstract class BaseMetricDocument
{
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string? Id { get; set; }
  
  public string Key { get; set; }
  
  public string Name { get; set; }
  
  public string? Description { get; set; }
  
  public MetricType Type { get; }
  
  public Dictionary<string, string> Flags { get; set; }
  
  public DateTime? LastMeasurementDate { get; set; }
}

public class CounterMetricDocument : BaseMetricDocument
{
}

public class GaugeMetricDocument : BaseMetricDocument
{
}

public class TimerMetricDocument : BaseMetricDocument
{
  public DateTime? StartDate { get; set; }
}