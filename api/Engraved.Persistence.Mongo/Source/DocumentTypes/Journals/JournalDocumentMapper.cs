using Engraved.Core.Domain.Journals;
using Engraved.Persistence.Mongo.DocumentTypes.Schedules;
using MongoDB.Bson;

namespace Engraved.Persistence.Mongo.DocumentTypes.Journals;

public static class JournalDocumentMapper
{
  public static JournalDocument ToDocument(IJournal journal)
  {
    return journal switch
    {
      CounterJournal cj => MapToCounterJournalDocument(cj),
      GaugeJournal gj => MapToGaugeJournalDocument(gj),
      TimerJournal tj => MapToTimerJournalDocument(tj),
      ScrapsJournal sj => MapToScrapsJournalDocument(sj),
      _ => throw new ArgumentOutOfRangeException(nameof(journal), journal, null)
    };
  }

  private static CounterJournalDocument MapToCounterJournalDocument(CounterJournal journal)
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
      Schedules = ScheduleMapper.MapSchedules(journal.Schedules)
    };
  }

  private static GaugeJournalDocument MapToGaugeJournalDocument(GaugeJournal journal)
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
      Schedules = ScheduleMapper.MapSchedules(journal.Schedules)
    };
  }

  private static TimerJournalDocument MapToTimerJournalDocument(TimerJournal journal)
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
      Schedules = ScheduleMapper.MapSchedules(journal.Schedules),
      StartDate = journal.StartDate
    };
  }

  private static ScrapsJournalDocument MapToScrapsJournalDocument(ScrapsJournal journal)
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
      Schedules = ScheduleMapper.MapSchedules(journal.Schedules)
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

  public static TJournal FromDocument<TJournal>(JournalDocument? document)
    where TJournal : class, IJournal
  {
    if (document == null)
    {
      return null!;
    }

    return document switch
    {
      CounterJournalDocument cj => MapFromCounterJournalDocument(cj) as TJournal,
      GaugeJournalDocument gj => MapFromGaugeJournalDocument(gj) as TJournal,
      TimerJournalDocument tj => MapFromTimerJournalDocument(tj) as TJournal,
      ScrapsJournalDocument sj => MapFromScrapsJournalDocument(sj) as TJournal,
      _ => throw new ArgumentOutOfRangeException(nameof(document), document, null)
    };
  }

  private static CounterJournal MapFromCounterJournalDocument(CounterJournalDocument document)
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
      Schedules = ScheduleMapper.MapSchedulesFromDocument(document.Schedules)
    };
  }

  private static GaugeJournal MapFromGaugeJournalDocument(GaugeJournalDocument document)
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
      Schedules = ScheduleMapper.MapSchedulesFromDocument(document.Schedules)
    };
  }

  private static TimerJournal MapFromTimerJournalDocument(TimerJournalDocument document)
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
      Schedules = ScheduleMapper.MapSchedulesFromDocument(document.Schedules),
      StartDate = document.StartDate
    };
  }

  private static ScrapsJournal MapFromScrapsJournalDocument(ScrapsJournalDocument document)
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
      Schedules = ScheduleMapper.MapSchedulesFromDocument(document.Schedules)
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
}
