namespace Metrix.Core.Domain.Measurements;

public class TimerMeasurement : BaseMeasurement
{
  public DateTime StartDate { get; set; }

  public DateTime? EndDate { get; set; }
  
  public override double GetValue()
  {
    // consider doing something like this:
    // return (EndDate ?? System.DateTime.UtcNow).Subtract(StartDate).Milliseconds;  
    
    throw new NotImplementedException($"{nameof(GetValue)} not yet implemented for {nameof(TimerMeasurement)}.");
  }
}
