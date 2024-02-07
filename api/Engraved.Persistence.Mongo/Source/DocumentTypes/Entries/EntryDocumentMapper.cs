using AutoMapper;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Entries;

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

        cfg.CreateMap<ScheduleSubDocument, Schedule>();
      }
    );

    configuration.AssertConfigurationIsValid();

    Mapper = configuration.CreateMapper();
  }

  public static EntryDocument ToDocument(IEntry journal)
  {
    return Mapper.Map<EntryDocument>(journal)!;
  }

  public static TEntry FromDocument<TEntry>(EntryDocument? document)
    where TEntry : class, IEntry
  {
    return document == null
      ? null!
      : (TEntry) Mapper.Map(document, document.GetType(), typeof(TEntry))!;
  }
}
