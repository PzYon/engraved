namespace Engraved.Core.Domain.Schedule;

public class Recurrence
{
  public DayOfWeek[] Days { get; set; } = [];

  public string Time { get; set; } = null!;
}
