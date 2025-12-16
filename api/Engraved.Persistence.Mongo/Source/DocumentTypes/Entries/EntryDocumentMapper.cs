using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Schedules;

namespace Engraved.Persistence.Mongo.DocumentTypes.Entries;

public static class EntryDocumentMapper
{
  public static EntryDocument ToDocument(IEntry entry)
  {
    return entry switch
    {
      CounterEntry ce => MapCounterEntry(ce),
      GaugeEntry ge => MapGaugeEntry(ge),
      TimerEntry te => MapTimerEntry(te),
      ScrapsEntry se => MapScrapsEntry(se),
      _ => throw new ArgumentOutOfRangeException(nameof(entry), entry, null)
    };
  }

  private static CounterEntryDocument MapCounterEntry(CounterEntry entry)
  {
    return new CounterEntryDocument
    {
      UserId = entry.UserId,
      ParentId = entry.ParentId,
      Notes = entry.Notes,
      DateTime = entry.DateTime,
      EditedOn = entry.EditedOn,
      JournalAttributeValues = entry.JournalAttributeValues,
      Schedules = MapSchedules(entry.Schedules)
    };
  }

  private static GaugeEntryDocument MapGaugeEntry(GaugeEntry entry)
  {
    return new GaugeEntryDocument
    {
      UserId = entry.UserId,
      ParentId = entry.ParentId,
      Notes = entry.Notes,
      DateTime = entry.DateTime,
      EditedOn = entry.EditedOn,
      JournalAttributeValues = entry.JournalAttributeValues,
      Schedules = MapSchedules(entry.Schedules),
      Value = entry.Value
    };
  }

  private static TimerEntryDocument MapTimerEntry(TimerEntry entry)
  {
    return new TimerEntryDocument
    {
      UserId = entry.UserId,
      ParentId = entry.ParentId,
      Notes = entry.Notes,
      DateTime = entry.DateTime,
      EditedOn = entry.EditedOn,
      JournalAttributeValues = entry.JournalAttributeValues,
      Schedules = MapSchedules(entry.Schedules),
      StartDate = entry.StartDate ?? default,
      EndDate = entry.EndDate
    };
  }

  private static ScrapsEntryDocument MapScrapsEntry(ScrapsEntry entry)
  {
    return new ScrapsEntryDocument
    {
      UserId = entry.UserId,
      ParentId = entry.ParentId,
      Notes = entry.Notes,
      DateTime = entry.DateTime,
      EditedOn = entry.EditedOn,
      JournalAttributeValues = entry.JournalAttributeValues,
      Schedules = MapSchedules(entry.Schedules),
      Title = entry.Title,
      ScrapType = entry.ScrapType
    };
  }

  private static Dictionary<string, ScheduleSubDocument> MapSchedules(Dictionary<string, Schedule> schedules)
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

  public static TEntry FromDocument<TEntry>(EntryDocument? document)
    where TEntry : class, IEntry
  {
    if (document == null)
    {
      return null!;
    }

    return document switch
           {
             CounterEntryDocument ced => MapToCounterEntry(ced) as TEntry,
             GaugeEntryDocument ged => MapToGaugeEntry(ged) as TEntry,
             ScrapsEntryDocument sed => MapToScrapsEntry(sed) as TEntry,
             TimerEntryDocument ted => MapToTimerEntry(ted) as TEntry,
             _ => throw new ArgumentOutOfRangeException(nameof(document), document, null)
           }
           ?? throw new InvalidCastException($"Cannot cast {document.GetType().Name} to {typeof(TEntry).Name}");
  }

  private static CounterEntry MapToCounterEntry(CounterEntryDocument document)
  {
    return new CounterEntry
    {
      Id = document.Id.ToString(),
      UserId = document.UserId,
      ParentId = document.ParentId,
      Notes = document.Notes,
      DateTime = document.DateTime,
      EditedOn = document.EditedOn,
      JournalAttributeValues = document.JournalAttributeValues,
      Schedules = MapSchedulesFromDocument(document.Schedules)
    };
  }

  private static GaugeEntry MapToGaugeEntry(GaugeEntryDocument document)
  {
    return new GaugeEntry
    {
      Id = document.Id.ToString(),
      UserId = document.UserId,
      ParentId = document.ParentId,
      Notes = document.Notes,
      DateTime = document.DateTime,
      EditedOn = document.EditedOn,
      JournalAttributeValues = document.JournalAttributeValues,
      Schedules = MapSchedulesFromDocument(document.Schedules),
      Value = document.Value
    };
  }

  private static TimerEntry MapToTimerEntry(TimerEntryDocument document)
  {
    return new TimerEntry
    {
      Id = document.Id.ToString(),
      UserId = document.UserId,
      ParentId = document.ParentId,
      Notes = document.Notes,
      DateTime = document.DateTime,
      EditedOn = document.EditedOn,
      JournalAttributeValues = document.JournalAttributeValues,
      Schedules = MapSchedulesFromDocument(document.Schedules),
      StartDate = document.StartDate,
      EndDate = document.EndDate
    };
  }

  private static ScrapsEntry MapToScrapsEntry(ScrapsEntryDocument document)
  {
    return new ScrapsEntry
    {
      Id = document.Id.ToString(),
      UserId = document.UserId,
      ParentId = document.ParentId,
      Notes = document.Notes,
      DateTime = document.DateTime,
      EditedOn = document.EditedOn,
      JournalAttributeValues = document.JournalAttributeValues,
      Schedules = MapSchedulesFromDocument(document.Schedules),
      Title = document.Title ?? string.Empty,
      ScrapType = document.ScrapType ?? ScrapType.Markdown
    };
  }

  private static Dictionary<string, Schedule> MapSchedulesFromDocument(
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
