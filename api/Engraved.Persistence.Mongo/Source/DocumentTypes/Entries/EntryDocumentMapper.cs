using Engraved.Core.Domain.Entries;
using Engraved.Persistence.Mongo.DocumentTypes.Schedules;

namespace Engraved.Persistence.Mongo.DocumentTypes.Entries;

public static class EntryDocumentMapper
{
  public static EntryDocument ToDocument(IEntry entry)
  {
    return entry switch
    {
      CounterEntry ce => MapToDocument(ce, new CounterEntryDocument()),

      GaugeEntry ge => MapToDocument(
        ge,
        new GaugeEntryDocument
        {
          Value = ge.Value
        }
      ),

      TimerEntry te => MapToDocument(
        te,
        new TimerEntryDocument
        {
          StartDate = te.StartDate ?? default,
          EndDate = te.EndDate
        }
      ),

      ScrapsEntry se => MapToDocument(
        se,
        new ScrapsEntryDocument
        {
          Title = se.Title,
          ScrapType = se.ScrapType
        }
      ),

      _ => throw new ArgumentOutOfRangeException(nameof(entry), entry, null)
    };
  }

  private static TDocument MapToDocument<TDocument>(IEntry entry, TDocument document)
    where TDocument : EntryDocument
  {
    document.UserId = entry.UserId;
    document.ParentId = entry.ParentId;
    document.Notes = entry.Notes;
    document.DateTime = entry.DateTime;
    document.EditedOn = entry.EditedOn;
    document.JournalAttributeValues = entry.JournalAttributeValues;
    document.Schedules = ScheduleMapper.MapSchedules(entry.Schedules);

    return document;
  }

  public static IEntry FromDocument(EntryDocument document)
  {
    return document switch
    {
      CounterEntryDocument ced => MapFromDocument(ced, new CounterEntry()),

      GaugeEntryDocument ged => MapFromDocument(
        ged,
        new GaugeEntry
        {
          Value = ged.Value
        }
      ),

      ScrapsEntryDocument sed => MapFromDocument(
        sed,
        new ScrapsEntry
        {
          Title = sed.Title ?? string.Empty,
          ScrapType = sed.ScrapType ?? ScrapType.Markdown
        }
      ),

      TimerEntryDocument ted => MapFromDocument(
        ted,
        new TimerEntry
        {
          StartDate = ted.StartDate,
          EndDate = ted.EndDate
        }
      ),

      _ => throw new ArgumentOutOfRangeException(nameof(document), document, null)
    };
  }

  private static TEntry MapFromDocument<TDocument, TEntry>(TDocument document, TEntry entry)
    where TDocument : EntryDocument
    where TEntry : IEntry
  {
    entry.Id = document.Id.ToString();
    entry.UserId = document.UserId;
    entry.ParentId = document.ParentId;
    entry.Notes = document.Notes;
    entry.DateTime = document.DateTime;
    entry.EditedOn = document.EditedOn;
    entry.JournalAttributeValues = document.JournalAttributeValues;
    entry.Schedules = ScheduleMapper.MapSchedulesFromDocument(document.Schedules);

    return entry;
  }
}
