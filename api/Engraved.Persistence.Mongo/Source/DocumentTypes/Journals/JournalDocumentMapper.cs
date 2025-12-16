using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Schedules;
using MongoDB.Bson;

namespace Engraved.Persistence.Mongo.DocumentTypes.Journals;

public static class JournalDocumentMapper
{
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
      Id = string.IsNullOrEmpty(journal.Id) ? ObjectId.Empty : ObjectId.Parse(journal.Id),
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
      Id = string.IsNullOrEmpty(journal.Id) ? ObjectId.Empty : ObjectId.Parse(journal.Id),
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
      Id = string.IsNullOrEmpty(journal.Id) ? ObjectId.Empty : ObjectId.Parse(journal.Id),
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

    return document switch
    {
      CounterJournalDocument cj => MapFromCounterJournal(cj) as TJournal,
      GaugeJournalDocument gj => MapFromGaugeJournal(gj) as TJournal,
      TimerJournalDocument tj => MapFromTimerJournal(tj) as TJournal,
      ScrapsJournalDocument sj => MapFromScrapsJournal(sj) as TJournal,
      _ => throw new ArgumentOutOfRangeException(nameof(document), document, null)
    };
  }

  private static CounterJournal MapFromCounterJournal(CounterJournalDocument document)
  {
    return new CounterJournal
    {
      Id = document.Id.ToString(),
      UserId = document.UserId,
      Name = document.Name!,
      Description = document.Description,
      Notes = document.Notes,
      Attributes = document.Attributes,
      Thresholds = MapThresholdsFromDocument(document.Thresholds),
      EditedOn = document.EditedOn,
      Permissions = document.Permissions,
      CustomProps = document.CustomProps,
      Schedules = MapSchedulesFromDocument(document.Schedules)
    };
  }

  private static GaugeJournal MapFromGaugeJournal(GaugeJournalDocument document)
  {
    return new GaugeJournal
    {
      Id = document.Id.ToString(),
      UserId = document.UserId,
      Name = document.Name!,
      Description = document.Description,
      Notes = document.Notes,
      Attributes = document.Attributes,
      Thresholds = MapThresholdsFromDocument(document.Thresholds),
      EditedOn = document.EditedOn,
      Permissions = document.Permissions,
      CustomProps = document.CustomProps,
      Schedules = MapSchedulesFromDocument(document.Schedules)
    };
  }

  private static TimerJournal MapFromTimerJournal(TimerJournalDocument document)
  {
    return new TimerJournal
    {
      Id = document.Id.ToString(),
      UserId = document.UserId,
      Name = document.Name!,
      Description = document.Description,
      Notes = document.Notes,
      Attributes = document.Attributes,
      Thresholds = MapThresholdsFromDocument(document.Thresholds),
      EditedOn = document.EditedOn,
      Permissions = document.Permissions,
      CustomProps = document.CustomProps,
      Schedules = MapSchedulesFromDocument(document.Schedules),
      StartDate = document.StartDate
    };
  }

  private static ScrapsJournal MapFromScrapsJournal(ScrapsJournalDocument document)
  {
    return new ScrapsJournal
    {
      Id = document.Id.ToString(),
      UserId = document.UserId,
      Name = document.Name!,
      Description = document.Description,
      Notes = document.Notes,
      Attributes = document.Attributes,
      Thresholds = MapThresholdsFromDocument(document.Thresholds),
      EditedOn = document.EditedOn,
      Permissions = document.Permissions,
      CustomProps = document.CustomProps,
      Schedules = MapSchedulesFromDocument(document.Schedules)
    };
  }

  private static Dictionary<string, Dictionary<string, ThresholdDefinition>> MapThresholdsFromDocument(
    Dictionary<string, Dictionary<string, ThresholdDefinitionDocument>> thresholds
  )
  {
    var result = new Dictionary<string, Dictionary<string, ThresholdDefinition>>();

    foreach (var (key, innerDict) in thresholds)
    {
      var innerResult = new Dictionary<string, ThresholdDefinition>();
      foreach ((var innerKey, ThresholdDefinitionDocument threshold) in innerDict)
      {
        innerResult[innerKey] = new ThresholdDefinition
        {
          Value = threshold.Value,
          Scope = threshold.Scope
        };
      }

      result[key] = innerResult;
    }

    return result;
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
