namespace Metrix.Core.Domain;

public class DummyMetricsLoader : IMetricsLoader
{
  public static readonly string MetricKey = "foo";

  public static Metric Metric = new()
  {
    Key = MetricKey,
    Name = "Dummy Metric",
    Description = "Lorim ipsum dolares.",
    Type = MetricType.Gauge,
    Unit = "kg"
  };

  public Metric[] GetMetrics()
  {
    return new[] { Metric };
  }
}
