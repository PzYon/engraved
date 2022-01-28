namespace Metrix.Core.Domain;

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
