using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using static System.String;

namespace Metrix.Core.Domain;

public static class DummyData
{
  private static string metricKey = "m3tr1c";

  public static List<Measurement> Measurements = Enumerable.Range(0, Random.Shared.Next(5, 20))
    .Select(_ => new Measurement
    {
      DateTime = GetRandomDate(),
      MetricKey = metricKey,
      Value = GetValue(),
      Notes = Random.Shared.Next(1, 3) > 1 ? LoremUtil.LoremIpsum(3, 15, 1, 4) : Empty
    })
    .OrderBy(m => m.DateTime)
    .ToList();

  public static List<Metric> Metrics = Enumerable.Range(0, Random.Shared.Next(5, 30))
    .Select(i => new Metric
    {
      Description = LoremUtil.LoremIpsum(0, 12, 1, 3),
      Key = "key" + i,
      Name = LoremUtil.LoremIpsum(1, 3, 1, 1),
      Type = MetricType.Gauge,
      Unit = "kg"
    })
    .ToList();

  private static DateTime GetRandomDate()
  {
    return DateTime.UtcNow.AddSeconds(-Random.Shared.Next(1000, 100000));
  }

  private static int GetValue()
  {
    return Random.Shared.Next(10, 40);
  }
}
