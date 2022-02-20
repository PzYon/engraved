using Metrix.Core.Domain.Measurements;
using static System.String;

namespace Metrix.Core.Domain;

public static class DummyData
{
  private static string metricKey = "m3tr1c";

  public static Measurement[] GetMeasurements()
  {
    return Enumerable.Range(0, Random.Shared.Next(5, 20))
      .Select(_ => new Measurement
      {
        DateTime = GetRandomDate(),
        MetricKey = metricKey,
        Value = GetValue(),
        Notes = Random.Shared.Next(1, 3) > 1 ? LoremUtil.LoremIpsum(3, 15, 1, 4) : Empty
      })
      .OrderBy(m => m.DateTime)
      .ToArray();
  }

  private static DateTime GetRandomDate()
  {
    return DateTime.UtcNow.AddSeconds(-Random.Shared.Next(1000, 100000));
  }

  private static int GetValue()
  {
    return Random.Shared.Next(10, 40);
  }
}
