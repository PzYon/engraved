namespace Metrix.Core.Domain;

public enum MetricType
{
  Counter,
  Gauge,
  Timed
}

public class Metric
{
  public string Key { get; set; }

  public string Name { get; set; }

  public string Description { get; set; }

  public MetricType Type { get; set; }

  public string Unit { get; set; }
}

public class Measurement
{
  public Metric Metric { get; set; }

  public long Value { get; set; }

  public string Notes { get; set; }

  public DateTime DateTime { get; set; }
}

public interface IMeasurementsLoader
{
  Measurement[] GetMeasurements(string metricKey);
}

public class MeasurementsLoader : IMeasurementsLoader
{
  private readonly IQueryable<Measurement> _allMeasurements;

  public MeasurementsLoader(IQueryable<Measurement> allMeasurements)
  {
    _allMeasurements = allMeasurements;
  }

  public Measurement[] GetMeasurements(string metricKey)
  {
    return _allMeasurements.Where(m => m.Metric.Key == metricKey).ToArray();
  }
}

public class DummyMeasurementsLoader : IMeasurementsLoader
{
  public Measurement[] GetMeasurements(string metricKey)
  {
    var metric = new Metric
    {
      Key = metricKey,
      Name = "Dummy Metric",
      Description = "Lorim ipsum dolares.",
      Type = MetricType.Gauge,
      Unit = "kg"
    };

    return Enumerable.Range(0, 10)
      .Select(_ => new Measurement
      {
        DateTime = GetRandomDate(),
        Metric = metric,
        Value = GetValue()
      })
      .ToArray();
  }

  private static DateTime GetRandomDate()
  {
    return DateTime.UtcNow.AddMinutes(Random.Shared.Next(0, 100));
  }

  private static int GetValue()
  {
    return Random.Shared.Next(10, 40);
  }
}