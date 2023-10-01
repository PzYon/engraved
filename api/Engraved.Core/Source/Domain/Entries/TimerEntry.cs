namespace Engraved.Core.Domain.Entries;

public class TimerEntry : BaseEntry
{
  public DateTime? StartDate { get; set; }

  public DateTime? EndDate { get; set; }

  public override double GetValue()
  {
    // consider doing something like this:
    // return (EndDate ?? System.DateTime.UtcNow).Subtract(StartDate).Milliseconds;  

    throw new NotImplementedException($"{nameof(GetValue)} not yet implemented for {nameof(TimerEntry)}.");
  }
}
