using AutoMapper;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Schedules;

namespace Engraved.Persistence.Mongo.DocumentTypes.Journals;

public static class JournalDocumentMapper
{
  private static readonly IMapper Mapper;

  static JournalDocumentMapper()
  {
    var configuration = new MapperConfiguration(cfg =>
      {
        cfg.CreateMap<IJournal, JournalDocument>()
          .Include<CounterJournal, CounterJournalDocument>()
          .Include<GaugeJournal, GaugeJournalDocument>()
          .Include<TimerJournal, TimerJournalDocument>()
          .Include<ScrapsJournal, ScrapsJournalDocument>();

        cfg.CreateMap<CounterJournal, CounterJournalDocument>();
        cfg.CreateMap<GaugeJournal, GaugeJournalDocument>();
        cfg.CreateMap<TimerJournal, TimerJournalDocument>();
        cfg.CreateMap<ScrapsJournal, ScrapsJournalDocument>();

        cfg.CreateMap<Recurrence, RecurrenceSubDocument>();
        cfg.CreateMap<Schedule, ScheduleSubDocument>();
        cfg.CreateMap<ThresholdDefinition, ThresholdDefinitionDocument>();

        cfg.CreateMap<JournalDocument, IJournal>()
          .Include<CounterJournalDocument, CounterJournal>()
          .Include<GaugeJournalDocument, GaugeJournal>()
          .Include<TimerJournalDocument, TimerJournal>()
          .Include<ScrapsJournalDocument, ScrapsJournal>();

        cfg.CreateMap<CounterJournalDocument, CounterJournal>();
        cfg.CreateMap<GaugeJournalDocument, GaugeJournal>();
        cfg.CreateMap<TimerJournalDocument, TimerJournal>();
        cfg.CreateMap<ScrapsJournalDocument, ScrapsJournal>();

        cfg.CreateMap<RecurrenceSubDocument, Recurrence>();
        cfg.CreateMap<ScheduleSubDocument, Schedule>();
        cfg.CreateMap<ThresholdDefinitionDocument, ThresholdDefinition>();
      }
    );

    // configuration.AssertConfigurationIsValid();

    Mapper = configuration.CreateMapper();
  }

  public static JournalDocument ToDocument(IJournal journal)
  {
    return journal switch
    {
      CounterJournal cj => MapCounterJournal(cj),
      GaugeJournal gj => MapGaugeJournal(gj),
      TimerJournal tj => MapTimerJournal(tj),
      ScrapsJournal sj => MapScrapsJournal(sj),
      _ => throw new ArgumentOutOfRangeException(nameof(journal), journal, null)
    };
  }

  private static CounterJournalDocument MapCounterJournal(CounterJournal journal)
  {
    return new CounterJournalDocument
    {
      UserId = journal.UserId,
      Name = journal.Name,
      Description = journal.Description,
      Notes = journal.Notes,
      Attributes = journal.Attributes,
      Thresholds = MapThresholds(journal.Thresholds),
      EditedOn = journal.EditedOn,
      Permissions = journal.Permissions,
      CustomProps = journal.CustomProps,
      Schedules = MapSchedules(journal.Schedules)
    };
  }

  private static GaugeJournalDocument MapGaugeJournal(GaugeJournal journal)
  {
    return new GaugeJournalDocument
    {
      UserId = journal.UserId,
      Name = journal.Name,
      Description = journal.Description,
      Notes = journal.Notes,
      Attributes = journal.Attributes,
      Thresholds = MapThresholds(journal.Thresholds),
      EditedOn = journal.EditedOn,
      Permissions = journal.Permissions,
      CustomProps = journal.CustomProps,
      Schedules = MapSchedules(journal.Schedules)
    };
  }

  private static TimerJournalDocument MapTimerJournal(TimerJournal journal)
  {
    return new TimerJournalDocument
    {
      UserId = journal.UserId,
      Name = journal.Name,
      Description = journal.Description,
      Notes = journal.Notes,
      Attributes = journal.Attributes,
      Thresholds = MapThresholds(journal.Thresholds),
      EditedOn = journal.EditedOn,
      Permissions = journal.Permissions,
      CustomProps = journal.CustomProps,
      Schedules = MapSchedules(journal.Schedules),
      StartDate = journal.StartDate
    };
  }

  private static ScrapsJournalDocument MapScrapsJournal(ScrapsJournal journal)
  {
    return new ScrapsJournalDocument
    {
      UserId = journal.UserId,
      Name = journal.Name,
      Description = journal.Description,
      Notes = journal.Notes,
      Attributes = journal.Attributes,
      Thresholds = MapThresholds(journal.Thresholds),
      EditedOn = journal.EditedOn,
      Permissions = journal.Permissions,
      CustomProps = journal.CustomProps,
      Schedules = MapSchedules(journal.Schedules)
    };
  }

  private static Dictionary<string, Dictionary<string, ThresholdDefinitionDocument>> MapThresholds(
    Dictionary<string, Dictionary<string, ThresholdDefinition>> thresholds
  )
  {
    var result = new Dictionary<string, Dictionary<string, ThresholdDefinitionDocument>>();

    foreach (var (key, innerDict) in thresholds)
    {
      var innerResult = new Dictionary<string, ThresholdDefinitionDocument>();
      foreach ((var innerKey, ThresholdDefinition threshold) in innerDict)
      {
        innerResult[innerKey] = new ThresholdDefinitionDocument
        {
          Value = threshold.Value,
          Scope = threshold.Scope
        };
      }

      result[key] = innerResult;
    }

    return result;
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

  public static TJournal FromDocument<TJournal>(JournalDocument? document) where TJournal : class, IJournal
  {
    if (document == null)
    {
      return null!;
    }

    return (TJournal) Mapper.Map(document, document.GetType(), typeof(TJournal))!;
  }
}
