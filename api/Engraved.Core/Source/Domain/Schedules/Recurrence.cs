namespace Engraved.Core.Domain.Schedules;

public class Recurrence
{
  public DayOfWeek[] Days { get; set; } = [];

  public string Time { get; set; } = null!;
}
