using AutoMapper;
using Engraved.Core.Domain.Measurements;

namespace Engraved.Persistence.Mongo.DocumentTypes.Measurements;

public static class MeasurementDocumentMapper
{
  private static readonly IMapper Mapper;

  static MeasurementDocumentMapper()
  {
    var configuration = new MapperConfiguration(
      cfg =>
      {
        cfg.CreateMap<IMeasurement, MeasurementDocument>()
          .Include<CounterMeasurement, CounterMeasurementDocument>()
          .Include<GaugeMeasurement, GaugeMeasurementDocument>()
          .Include<TimerMeasurement, TimerMeasurementDocument>();

        cfg.CreateMap<CounterMeasurement, CounterMeasurementDocument>();
        cfg.CreateMap<GaugeMeasurement, GaugeMeasurementDocument>();
        cfg.CreateMap<TimerMeasurement, TimerMeasurementDocument>();

        cfg.CreateMap<MeasurementDocument, IMeasurement>()
          .Include<CounterMeasurementDocument, CounterMeasurement>()
          .Include<GaugeMeasurementDocument, GaugeMeasurement>()
          .Include<TimerMeasurementDocument, TimerMeasurement>();

        cfg.CreateMap<CounterMeasurementDocument, CounterMeasurement>();
        cfg.CreateMap<GaugeMeasurementDocument, GaugeMeasurement>();
        cfg.CreateMap<TimerMeasurementDocument, TimerMeasurement>();
      }
    );

    configuration.AssertConfigurationIsValid();

    Mapper = configuration.CreateMapper();
  }

  public static MeasurementDocument ToDocument(IMeasurement metric)
  {
    return Mapper.Map<MeasurementDocument>(metric);
  }

  public static TMeasurement FromDocument<TMeasurement>(MeasurementDocument? document)
    where TMeasurement : class, IMeasurement
  {
    return document == null
      ? null!
      : (TMeasurement)Mapper.Map(document, document.GetType(), typeof(TMeasurement));
  }
}
