namespace Metrix.Core.Domain;

public class DummyMeasurementsLoader : IMeasurementsLoader
{
  public Measurement[] GetMeasurements(string metricKey)
  {
    return Enumerable.Range(0, Random.Shared.Next(5, 20))
      .Select(_ => new Measurement
      {
        DateTime = GetRandomDate(),
        MetricKey = metricKey,
        Value = GetValue()
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
