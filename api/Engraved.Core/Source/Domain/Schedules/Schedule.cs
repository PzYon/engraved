namespace Engraved.Core.Domain.Schedules;

public class Schedule
{
  public DateTime? NextOccurrence { get; set; }
  
  public Recurrence? Recurrence { get; set; }

  public bool DidNotify { get; set; }
  
  public string? OnClickUrl { get; set; }
}
