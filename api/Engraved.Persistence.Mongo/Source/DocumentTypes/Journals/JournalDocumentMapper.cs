using AutoMapper;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Schedules;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;

namespace Engraved.Persistence.Mongo.DocumentTypes.Journals;

public class JournalDocumentMapper
{
  private readonly IMapper mapper;

public  JournalDocumentMapper(ILoggerFactory loggerFactory)
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

        cfg.CreateMap<Recurrence, RecurrenceSubDocument>();
        cfg.CreateMap<Schedule, ScheduleSubDocument>();
        cfg.CreateMap<ThresholdDefinition, ThresholdDefinitionDocument>();

        cfg.CreateMap<JournalDocument, IJournal>()
          .Include<CounterJournalDocument, CounterJournal>()
          .Include<GaugeJournalDocument, GaugeJournal>()
          .Include<TimerJournalDocument, TimerJournal>()
          .Include<ScrapsJournalDocument, ScrapsJournal>();

        cfg.CreateMap<CounterJournalDocument, CounterJournal>();
        cfg.CreateMap<GaugeJournalDocument, GaugeJournal>();
        cfg.CreateMap<TimerJournalDocument, TimerJournal>();
        cfg.CreateMap<ScrapsJournalDocument, ScrapsJournal>();

        cfg.CreateMap<RecurrenceSubDocument, Recurrence>();
        cfg.CreateMap<ScheduleSubDocument, Schedule>();
        cfg.CreateMap<ThresholdDefinitionDocument, ThresholdDefinition>();
      },
      loggerFactory
    );

    // configuration.AssertConfigurationIsValid();

    mapper = configuration.CreateMapper();
  }

  public JournalDocument ToDocument(IJournal journal)
  {
    return mapper.Map<JournalDocument>(journal)!;
  }

  public TJournal FromDocument<TJournal>(JournalDocument? document) where TJournal : class, IJournal
  {
    return document == null
      ? null!
      : (TJournal) mapper.Map(document, document.GetType(), typeof(TJournal))!;
  }
}
