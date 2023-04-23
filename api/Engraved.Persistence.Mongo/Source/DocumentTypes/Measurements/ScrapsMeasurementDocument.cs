using Engraved.Core.Domain.Measurements;

namespace Engraved.Persistence.Mongo.DocumentTypes.Measurements;

public class ScrapsMeasurementDocument : MeasurementDocument
{
  public string? Title { get; set; }
  
  public ScrapType? ScrapType { get; set; }
}
