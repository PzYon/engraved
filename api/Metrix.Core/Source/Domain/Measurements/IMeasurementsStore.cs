namespace Metrix.Core.Domain.Measurements;

public interface IMeasurementsStore
{
  Measurement[] GetMeasurements(string metricKey);

  void AddMeasurement(Measurement measurement);
}
