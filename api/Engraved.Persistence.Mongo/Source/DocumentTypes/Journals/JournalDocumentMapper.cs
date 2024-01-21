using AutoMapper;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Journals;

namespace Engraved.Persistence.Mongo.DocumentTypes.Journals;

public static class JournalDocumentMapper
{
  private static readonly IMapper Mapper;

  static JournalDocumentMapper()
  {
    var configuration = new MapperConfiguration(
      cfg =>
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

        cfg.CreateMap<Schedule, ScheduleSubDocument>();

        cfg.CreateMap<JournalDocument, IJournal>()
          .Include<CounterJournalDocument, CounterJournal>()
          .Include<GaugeJournalDocument, GaugeJournal>()
          .Include<TimerJournalDocument, TimerJournal>()
          .Include<ScrapsJournalDocument, ScrapsJournal>();

        cfg.CreateMap<CounterJournalDocument, CounterJournal>();
        cfg.CreateMap<GaugeJournalDocument, GaugeJournal>();
        cfg.CreateMap<TimerJournalDocument, TimerJournal>();
        cfg.CreateMap<ScrapsJournalDocument, ScrapsJournal>();

        cfg.CreateMap<ScheduleSubDocument, Schedule>();
      }
    );

    // configuration.AssertConfigurationIsValid();

    Mapper = configuration.CreateMapper();
  }

  public static JournalDocument ToDocument(IJournal journal)
  {
    return Mapper.Map<JournalDocument>(journal);
  }

  public static TJournal FromDocument<TJournal>(JournalDocument? document) where TJournal : class, IJournal
  {
    return document == null
      ? null!
      : (TJournal) Mapper.Map(document, document.GetType(), typeof(TJournal));
  }
}
