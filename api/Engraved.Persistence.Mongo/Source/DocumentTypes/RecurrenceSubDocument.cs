using DayOfWeek = Engraved.Core.Domain.Schedules.DayOfWeek;

namespace Engraved.Persistence.Mongo.DocumentTypes;

public class RecurrenceSubDocument
{
  public DayOfWeek[] Days { get; set; } = [];

  public string Time { get; set; } = null!;
}
