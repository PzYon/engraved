using Engraved.Core.Domain.Entries;
using Engraved.Persistence.Mongo.DocumentTypes.Schedules;

namespace Engraved.Persistence.Mongo.DocumentTypes.Entries;

public static class EntryDocumentMapper
{
  public static EntryDocument ToDocument(IEntry entry)
  {
    return entry switch
    {
      CounterEntry ce => MapToCounterEntryDocument(ce),
      GaugeEntry ge => MapToGaugeEntryDocument(ge),
      TimerEntry te => MapToTimerEntryDocument(te),
      ScrapsEntry se => MapToScrapsEntryDocument(se),
      _ => throw new ArgumentOutOfRangeException(nameof(entry), entry, null)
    };
  }

  private static CounterEntryDocument MapToCounterEntryDocument(CounterEntry entry)
  {
    var document = new CounterEntryDocument();
    MapCommonPropertiesToDocument(entry, document);
    return document;
  }

  private static GaugeEntryDocument MapToGaugeEntryDocument(GaugeEntry entry)
  {
    var document = new GaugeEntryDocument();
    MapCommonPropertiesToDocument(entry, document);
    document.Value = entry.Value;
    return document;
  }

  private static TimerEntryDocument MapToTimerEntryDocument(TimerEntry entry)
  {
    var document = new TimerEntryDocument();
    MapCommonPropertiesToDocument(entry, document);
    document.StartDate = entry.StartDate ?? default;
    document.EndDate = entry.EndDate;
    return document;
  }

  private static ScrapsEntryDocument MapToScrapsEntryDocument(ScrapsEntry entry)
  {
    var document = new ScrapsEntryDocument();
    MapCommonPropertiesToDocument(entry, document);
    document.Title = entry.Title;
    document.ScrapType = entry.ScrapType;
    return document;
  }

  private static void MapCommonPropertiesToDocument(IEntry entry, EntryDocument document)
  {
    document.UserId = entry.UserId;
    document.ParentId = entry.ParentId;
    document.Notes = entry.Notes;
    document.DateTime = entry.DateTime;
    document.EditedOn = entry.EditedOn;
    document.JournalAttributeValues = entry.JournalAttributeValues;
    document.Schedules = ScheduleMapper.MapSchedules(entry.Schedules);
  }

  public static TEntry FromDocument<TEntry>(EntryDocument? document)
    where TEntry : class, IEntry
  {
    return document switch
    {
      null => null,
      CounterEntryDocument ced => MapFromCounterEntryDocument(ced) as TEntry,
      GaugeEntryDocument ged => MapFromGaugeEntryDocument(ged) as TEntry,
      ScrapsEntryDocument sed => MapFromScrapsEntryDocument(sed) as TEntry,
      TimerEntryDocument ted => MapFromTimerEntryDocument(ted) as TEntry,
      _ => throw new ArgumentOutOfRangeException(nameof(document), document, null)
    };
  }

  private static CounterEntry MapFromCounterEntryDocument(CounterEntryDocument document)
  {
    var entry = new CounterEntry();
    MapCommonPropertiesFromDocument(document, entry);
    return entry;
  }

  private static GaugeEntry MapFromGaugeEntryDocument(GaugeEntryDocument document)
  {
    var entry = new GaugeEntry();
    MapCommonPropertiesFromDocument(document, entry);
    entry.Value = document.Value;
    return entry;
  }

  private static TimerEntry MapFromTimerEntryDocument(TimerEntryDocument document)
  {
    var entry = new TimerEntry();
    MapCommonPropertiesFromDocument(document, entry);
    entry.StartDate = document.StartDate;
    entry.EndDate = document.EndDate;
    return entry;
  }

  private static ScrapsEntry MapFromScrapsEntryDocument(ScrapsEntryDocument document)
  {
    var entry = new ScrapsEntry();
    MapCommonPropertiesFromDocument(document, entry);
    entry.Title = document.Title ?? string.Empty;
    entry.ScrapType = document.ScrapType ?? ScrapType.Markdown;
    return entry;
  }

  private static void MapCommonPropertiesFromDocument(EntryDocument document, IEntry entry)
  {
    entry.Id = document.Id.ToString();
    entry.UserId = document.UserId;
    entry.ParentId = document.ParentId;
    entry.Notes = document.Notes;
    entry.DateTime = document.DateTime;
    entry.EditedOn = document.EditedOn;
    entry.JournalAttributeValues = document.JournalAttributeValues;
    entry.Schedules = ScheduleMapper.MapSchedulesFromDocument(document.Schedules);
  }
}
