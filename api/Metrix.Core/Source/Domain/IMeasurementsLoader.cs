namespace Metrix.Core.Domain;

public interface IMeasurementsLoader
{
  Measurement[] GetMeasurements(string metricKey);
}
