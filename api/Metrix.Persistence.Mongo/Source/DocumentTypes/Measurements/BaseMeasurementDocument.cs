namespace Metrix.Persistence.Mongo.DocumentTypes.Measurements;

public abstract class BaseMeasurementDocument : IMeasurementDocument
{
  public string MetricKey { get; set; }
  public string? Notes { get; set; }
  public DateTime? DateTime { get; set; }
  public string? MetricFlagKey { get; set; }
}
