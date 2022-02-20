namespace Metrix.Core.Domain;

public interface IMeasurementsStore
{
  Measurement[] GetMeasurements(string metricKey);

  void AddMeasurement(Measurement measurement);
}
