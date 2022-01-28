namespace Metrix.Core.Domain;

public class DummyMetricsLoader : IMetricsLoader
{
  public Metric[] GetMetrics()
  {
    return Enumerable.Range(0, Random.Shared.Next(5, 30))
      .Select(i => new Metric
      {
        Description = "Eifach irgendöpis.",
        Key = "key" + i,
        Name = "Metric " + i,
        Type = MetricType.Gauge,
        Unit = "kg"
      })
      .ToArray();
  }
}
