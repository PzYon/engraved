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

public interface IMetricsLoader
{
  Metric[] GetMetrics();
}

public class DummyMetricsLoader : IMetricsLoader
{
  public static readonly string MetricKey = "foo";

  public static Metric Metric = new Metric
  {
    Key = MetricKey,
    Name = "Dummy Metric",
    Description = "Lorim ipsum dolares.",
    Type = MetricType.Gauge,
    Unit = "kg"
  };

  public Metric[] GetMetrics()
  {
    return new[] {Metric};
  }
}

public interface IMeasurementsLoader
{
  Measurement[] GetMeasurements(string metricKey);
}

public class DummyMeasurementsLoader : IMeasurementsLoader
{
  public Measurement[] GetMeasurements(string metricKey)
  {
    return Enumerable.Range(0, 10)
      .Select(_ => new Measurement
      {
        DateTime = GetRandomDate(),
        Metric = DummyMetricsLoader.Metric,
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