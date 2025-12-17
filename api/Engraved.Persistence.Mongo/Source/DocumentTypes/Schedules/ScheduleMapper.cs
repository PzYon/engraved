using Engraved.Core.Domain.Schedules;

namespace Engraved.Persistence.Mongo.DocumentTypes.Schedules;

public static class ScheduleMapper
{
  public static Dictionary<string, ScheduleSubDocument> MapSchedules(Dictionary<string, Schedule> schedules)
  {
    var result = new Dictionary<string, ScheduleSubDocument>();

    foreach ((var key, Schedule schedule) in schedules)
    {
      result[key] = new ScheduleSubDocument
      {
        NextOccurrence = schedule.NextOccurrence,
        Recurrence = schedule.Recurrence != null
          ? new RecurrenceSubDocument { DateString = schedule.Recurrence.DateString }
          : null,
        DidNotify = schedule.DidNotify,
        NotificationId = schedule.NotificationId,
        OnClickUrl = schedule.OnClickUrl
      };
    }

    return result;
  }

  public static Dictionary<string, Schedule> MapSchedulesFromDocument(
    Dictionary<string, ScheduleSubDocument> schedules
  )
  {
    var result = new Dictionary<string, Schedule>();

    foreach ((var key, ScheduleSubDocument schedule) in schedules)
    {
      result[key] = new Schedule
      {
        NextOccurrence = schedule.NextOccurrence,
        Recurrence = schedule.Recurrence != null
          ? new Recurrence { DateString = schedule.Recurrence.DateString }
          : null,
        DidNotify = schedule.DidNotify,
        NotificationId = schedule.NotificationId,
        OnClickUrl = schedule.OnClickUrl
      };
    }

    return result;
  }
}
