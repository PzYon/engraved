﻿using Metrix.Core.Domain.Metrics;
using MongoDB.Bson;

namespace Metrix.Persistence.Mongo.DocumentTypes.Metrics;

public abstract class MetricDocument
{
  public ObjectId Id { get; set; }
  
  public string Name { get; set; }

  public string? Description { get; set; }

  public abstract MetricType Type { get; }

  public Dictionary<string, string> Flags { get; set; }

  public DateTime? LastMeasurementDate { get; set; }
}
