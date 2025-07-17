using AutoMapper;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Schedules;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;

namespace Engraved.Persistence.Mongo.DocumentTypes.Entries;

public class EntryDocumentMapper
{
  private readonly IMapper mapper;

  public EntryDocumentMapper(ILoggerFactory loggerFactory)
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
      },
      loggerFactory
    );

    configuration.AssertConfigurationIsValid();

    mapper = configuration.CreateMapper();
  }

  public EntryDocument ToDocument(IEntry journal)
  {
    return mapper.Map<EntryDocument>(journal)!;
  }

  public TEntry FromDocument<TEntry>(EntryDocument? document)
    where TEntry : class, IEntry
  {
    return document == null
      ? null!
      : (TEntry)mapper.Map(document, document.GetType(), typeof(TEntry))!;
  }
}
