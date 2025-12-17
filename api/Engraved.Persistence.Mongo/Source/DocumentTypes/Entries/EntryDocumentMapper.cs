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
    return new CounterEntryDocument
    {
      UserId = entry.UserId,
      ParentId = entry.ParentId,
      Notes = entry.Notes,
      DateTime = entry.DateTime,
      EditedOn = entry.EditedOn,
      JournalAttributeValues = entry.JournalAttributeValues,
      Schedules = ScheduleMapper.MapSchedules(entry.Schedules)
    };
  }

  private static GaugeEntryDocument MapToGaugeEntryDocument(GaugeEntry entry)
  {
    return new GaugeEntryDocument
    {
      UserId = entry.UserId,
      ParentId = entry.ParentId,
      Notes = entry.Notes,
      DateTime = entry.DateTime,
      EditedOn = entry.EditedOn,
      JournalAttributeValues = entry.JournalAttributeValues,
      Schedules = ScheduleMapper.MapSchedules(entry.Schedules),
      Value = entry.Value
    };
  }

  private static TimerEntryDocument MapToTimerEntryDocument(TimerEntry entry)
  {
    return new TimerEntryDocument
    {
      UserId = entry.UserId,
      ParentId = entry.ParentId,
      Notes = entry.Notes,
      DateTime = entry.DateTime,
      EditedOn = entry.EditedOn,
      JournalAttributeValues = entry.JournalAttributeValues,
      Schedules = ScheduleMapper.MapSchedules(entry.Schedules),
      StartDate = entry.StartDate ?? default,
      EndDate = entry.EndDate
    };
  }

  private static ScrapsEntryDocument MapToScrapsEntryDocument(ScrapsEntry entry)
  {
    return new ScrapsEntryDocument
    {
      UserId = entry.UserId,
      ParentId = entry.ParentId,
      Notes = entry.Notes,
      DateTime = entry.DateTime,
      EditedOn = entry.EditedOn,
      JournalAttributeValues = entry.JournalAttributeValues,
      Schedules = ScheduleMapper.MapSchedules(entry.Schedules),
      Title = entry.Title,
      ScrapType = entry.ScrapType
    };
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
      CounterEntryDocument ced => MapFromCounterEntryDocument(ced) as TEntry,
      GaugeEntryDocument ged => MapFromGaugeEntryDocument(ged) as TEntry,
      ScrapsEntryDocument sed => MapFromScrapsEntryDocument(sed) as TEntry,
      TimerEntryDocument ted => MapFromTimerEntryDocument(ted) as TEntry,
      _ => throw new ArgumentOutOfRangeException(nameof(document), document, null)
    };
  }

  private static CounterEntry MapFromCounterEntryDocument(CounterEntryDocument document)
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
      Schedules = ScheduleMapper.MapSchedulesFromDocument(document.Schedules)
    };
  }

  private static GaugeEntry MapFromGaugeEntryDocument(GaugeEntryDocument document)
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
      Schedules = ScheduleMapper.MapSchedulesFromDocument(document.Schedules),
      Value = document.Value
    };
  }

  private static TimerEntry MapFromTimerEntryDocument(TimerEntryDocument document)
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
      Schedules = ScheduleMapper.MapSchedulesFromDocument(document.Schedules),
      StartDate = document.StartDate,
      EndDate = document.EndDate
    };
  }

  private static ScrapsEntry MapFromScrapsEntryDocument(ScrapsEntryDocument document)
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
      Schedules = ScheduleMapper.MapSchedulesFromDocument(document.Schedules),
      Title = document.Title ?? string.Empty,
      ScrapType = document.ScrapType ?? ScrapType.Markdown
    };
  }
}
