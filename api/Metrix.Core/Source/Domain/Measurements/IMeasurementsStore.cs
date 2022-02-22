using Metrix.Core.Application.Commands.Measurements.Add;

namespace Metrix.Core.Domain.Measurements;

public interface IMeasurementsStore
{
  Measurement[] GetAll(string metricKey);

  void Add(AddMeasurementCommand command);
}
