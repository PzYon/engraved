using AutoMapper;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Schedules;

namespace Engraved.Persistence.Mongo.DocumentTypes.Entries;

public static class EntryDocumentMapper
{
  private static readonly IMapper Mapper;

  static EntryDocumentMapper()
  {
    var configuration = new MapperConfiguration(
      cfg =>
      {
        cfg.CreateMap<IEntry, EntryDocument>()
          .Include<CounterEntry, CounterEntryDocument>()
          .Include<GaugeEntry, GaugeEntryDocument>()
          .Include<TimerEntry, TimerEntryDocument>()
          .Include<ScrapsEntry, ScrapsEntryDocument>();

        cfg.CreateMap<CounterEntry, CounterEntryDocument>();
        cfg.CreateMap<GaugeEntry, GaugeEntryDocument>();
        cfg.CreateMap<TimerEntry, TimerEntryDocument>();
        cfg.CreateMap<ScrapsEntry, ScrapsEntryDocument>();

        cfg.CreateMap<Recurrence, RecurrenceSubDocument>();
        cfg.CreateMap<Schedule, ScheduleSubDocument>();

        cfg.CreateMap<EntryDocument, IEntry>()
          .Include<CounterEntryDocument, CounterEntry>()
          .Include<GaugeEntryDocument, GaugeEntry>()
          .Include<TimerEntryDocument, TimerEntry>()
          .Include<ScrapsEntryDocument, ScrapsEntry>();

        cfg.CreateMap<CounterEntryDocument, CounterEntry>();
        cfg.CreateMap<GaugeEntryDocument, GaugeEntry>();
        cfg.CreateMap<TimerEntryDocument, TimerEntry>();
        cfg.CreateMap<ScrapsEntryDocument, ScrapsEntry>();

        cfg.CreateMap<RecurrenceSubDocument, Recurrence>();
        cfg.CreateMap<ScheduleSubDocument, Schedule>();
      }
    );

    configuration.AssertConfigurationIsValid();

    Mapper = configuration.CreateMapper();
  }

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
    
    foreach (var (key, schedule) in schedules)
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
    return document == null
      ? null!
      : (TEntry)Mapper.Map(document, document.GetType(), typeof(TEntry))!;
  }
}
