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
      CounterJournal cj => MapToDocument(cj, new CounterJournalDocument()),

      GaugeJournal gj => MapToDocument(gj, new GaugeJournalDocument()),

      TimerJournal tj => MapToDocument(
        tj,
        new TimerJournalDocument
        {
          StartDate = tj.StartDate
        }
      ),

      ScrapsJournal sj => MapToDocument(sj, new ScrapsJournalDocument()),

      _ => throw new ArgumentOutOfRangeException(nameof(journal), journal, null)
    };
  }

  private static TDocument MapToDocument<TDocument>(IJournal journal, TDocument document)
    where TDocument : JournalDocument
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

    return document;
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
      CounterJournalDocument cj => MapFromDocument(cj, new CounterJournal()),

      GaugeJournalDocument gj => MapFromDocument(gj, new GaugeJournal()),

      TimerJournalDocument tj => MapFromDocument(
        tj,
        new TimerJournal
        {
          StartDate = tj.StartDate
        }
      ),

      ScrapsJournalDocument sj => MapFromDocument(sj, new ScrapsJournal()),

      _ => null
    };
  }

  private static TJournal MapFromDocument<TJournal>(JournalDocument document, TJournal journal)
    where TJournal : IJournal
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

    return journal;
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
