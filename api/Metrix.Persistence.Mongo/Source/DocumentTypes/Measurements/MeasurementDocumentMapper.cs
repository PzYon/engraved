using Metrix.Core.Domain.Measurements;

namespace Metrix.Persistence.Mongo.DocumentTypes.Measurements;

public static class MeasurementDocumentMapper
{
  public static TResult FromDocument<TResult>(IMeasurementDocument arg) where TResult : IMeasurement
  {
    throw new NotImplementedException();
  }
}
