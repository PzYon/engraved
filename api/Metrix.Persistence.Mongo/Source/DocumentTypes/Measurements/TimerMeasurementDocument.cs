namespace Metrix.Persistence.Mongo.DocumentTypes.Measurements;

public class TimerMeasurementDocument : BaseMeasurementDocument
{
  public DateTime StartDate { get; set; }

  public DateTime? EndDate { get; set; }
}
