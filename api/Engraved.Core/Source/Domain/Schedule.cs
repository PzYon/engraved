namespace Engraved.Core.Domain;

public class Schedule
{
  public DateTime? NextOccurrence { get; set; }

  public bool DidNotify { get; set; }
}
