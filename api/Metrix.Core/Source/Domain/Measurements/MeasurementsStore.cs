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

  public void AddMeasurement(Measurement measurement)
  {
    _measurements.Add(measurement);
  }
}
