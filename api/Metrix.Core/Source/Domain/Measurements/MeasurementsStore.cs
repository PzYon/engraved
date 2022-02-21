using Metrix.Core.Application.Commands.Measurements.Add;

namespace Metrix.Core.Domain.Measurements;

public class MeasurementsStore : IMeasurementsStore
{
  private readonly List<Measurement> _measurements;

  public MeasurementsStore() : this(new List<Measurement>())
  {
  }

  public MeasurementsStore(List<Measurement> measurements)
  {
    _measurements = measurements;
  }

  public Measurement[] GetMeasurements(string metricKey)
  {
    return _measurements.Where(m => m.MetricKey == metricKey).ToArray();
  }

  public void AddMeasurement(AddMeasurementCommand command)
  {
    // todo: check if metric exists, etc.

    var measurement = new Measurement
    {
      Value = 1,
      MetricKey = command.MetricKey,
      DateTime = command.DateTime,
      Notes = command.Notes
    };

    _measurements.Add(measurement);
  }
}
