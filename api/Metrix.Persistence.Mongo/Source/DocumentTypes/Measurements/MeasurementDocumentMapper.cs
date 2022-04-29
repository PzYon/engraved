using AutoMapper;
using Metrix.Core.Domain.Measurements;

namespace Metrix.Persistence.Mongo.DocumentTypes.Measurements;

public static class MeasurementDocumentMapper
{
  private static readonly IMapper Mapper;

  static MeasurementDocumentMapper()
  {
    var configuration = new MapperConfiguration(
      cfg =>
      {
        cfg.CreateMap<IMeasurement, IMeasurementDocument>()
          .Include<CounterMeasurement, CounterMeasurementDocument>()
          .Include<GaugeMeasurement, GaugeMeasurementDocument>()
          .Include<TimerMeasurement, TimerMeasurementDocument>();

        cfg.CreateMap<CounterMeasurement, CounterMeasurementDocument>();
        cfg.CreateMap<GaugeMeasurement, GaugeMeasurementDocument>();
        cfg.CreateMap<TimerMeasurement, TimerMeasurementDocument>();

        cfg.CreateMap<IMeasurementDocument, IMeasurement>()
          .Include<CounterMeasurementDocument, CounterMeasurement>()
          .Include<GaugeMeasurementDocument, GaugeMeasurement>()
          .Include<TimerMeasurementDocument, TimerMeasurement>();

        cfg.CreateMap<CounterMeasurementDocument, CounterMeasurement>();
        cfg.CreateMap<GaugeMeasurementDocument, GaugeMeasurement>();
        cfg.CreateMap<TimerMeasurementDocument, TimerMeasurement>();
      }
    );

    // configuration.AssertConfigurationIsValid();

    Mapper = configuration.CreateMapper();
  }

  public static IMeasurementDocument ToDocument(IMeasurement metric)
  {
    return Mapper.Map<IMeasurementDocument>(metric);
  }

  public static TMeasurement FromDocument<TMeasurement>(IMeasurementDocument document) where TMeasurement : IMeasurement
  {
    return (TMeasurement)Mapper.Map(document, document.GetType(), typeof(TMeasurement));
  }
}
