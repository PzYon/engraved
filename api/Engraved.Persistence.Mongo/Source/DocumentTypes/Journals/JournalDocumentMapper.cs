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
    var document = new CounterJournalDocument();

    MapCommonPropertiesToDocument(journal, document);

    return document;
  }

  private static GaugeJournalDocument MapToGaugeJournalDocument(GaugeJournal journal)
  {
    var document = new GaugeJournalDocument();

    MapCommonPropertiesToDocument(journal, document);

    return document;
  }

  private static TimerJournalDocument MapToTimerJournalDocument(TimerJournal journal)
  {
    var document = new TimerJournalDocument
    {
      StartDate = journal.StartDate
    };

    MapCommonPropertiesToDocument(journal, document);

    return document;
  }

  private static ScrapsJournalDocument MapToScrapsJournalDocument(ScrapsJournal journal)
  {
    var document = new ScrapsJournalDocument();

    MapCommonPropertiesToDocument(journal, document);

    return document;
  }

  private static void MapCommonPropertiesToDocument(IJournal journal, JournalDocument document)
  {
    document.Id = string.IsNullOrEmpty(journal.Id) ? ObjectId.Empty : ObjectId.Parse(journal.Id);
    document.UserId = journal.UserId;
    document.Name = journal.Name;
    document.Description = journal.Description;
    document.Notes = journal.Notes;
    document.Attributes = journal.Attributes;
    document.Thresholds = MapThresholds(journal.Thresholds);
    document.EditedOn = journal.EditedOn;
    document.Permissions = journal.Permissions;
    document.CustomProps = journal.CustomProps;
    document.Schedules = ScheduleMapper.MapSchedules(journal.Schedules);
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

  public static IJournal? FromDocument(JournalDocument? document)
  {
    return document switch
    {
      CounterJournalDocument cj => MapFromCounterJournalDocument(cj),
      GaugeJournalDocument gj => MapFromGaugeJournalDocument(gj),
      TimerJournalDocument tj => MapFromTimerJournalDocument(tj),
      ScrapsJournalDocument sj => MapFromScrapsJournalDocument(sj),
      _ => null
    };
  }

  private static CounterJournal MapFromCounterJournalDocument(CounterJournalDocument document)
  {
    var journal = new CounterJournal();

    MapCommonPropertiesFromDocument(document, journal);

    return journal;
  }

  private static GaugeJournal MapFromGaugeJournalDocument(GaugeJournalDocument document)
  {
    var journal = new GaugeJournal();

    MapCommonPropertiesFromDocument(document, journal);

    return journal;
  }

  private static TimerJournal MapFromTimerJournalDocument(TimerJournalDocument document)
  {
    var journal = new TimerJournal
    {
      StartDate = document.StartDate
    };

    MapCommonPropertiesFromDocument(document, journal);

    return journal;
  }

  private static ScrapsJournal MapFromScrapsJournalDocument(ScrapsJournalDocument document)
  {
    var journal = new ScrapsJournal();

    MapCommonPropertiesFromDocument(document, journal);

    return journal;
  }

  private static void MapCommonPropertiesFromDocument(JournalDocument document, IJournal journal)
  {
    journal.Id = document.Id.ToString();
    journal.UserId = document.UserId;
    journal.Name = document.Name!;
    journal.Description = document.Description;
    journal.Notes = document.Notes;
    journal.Attributes = document.Attributes;
    journal.Thresholds = MapThresholdsFromDocument(document.Thresholds);
    journal.EditedOn = document.EditedOn;
    journal.Permissions = document.Permissions;
    journal.CustomProps = document.CustomProps;
    journal.Schedules = ScheduleMapper.MapSchedulesFromDocument(document.Schedules);
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
