namespace Metrix.Core.Domain.Measurements;

public class TimerMeasurement : BaseMeasurement
{
  public DateTime StartDate { get; set; }

  public DateTime EndDate { get; set; }
}
