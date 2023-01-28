namespace Engraved.Persistence.Mongo.DocumentTypes.Measurements;

public class TimerMeasurementDocument : MeasurementDocument
{
  public DateTime StartDate { get; set; }

  public DateTime? EndDate { get; set; }
}
