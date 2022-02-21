using Metrix.Core.Application.Commands.Measurements.Add;

namespace Metrix.Core.Domain.Measurements;

public interface IMeasurementsStore
{
  Measurement[] GetMeasurements(string metricKey);

  void AddMeasurement(AddMeasurementCommand command);
}
