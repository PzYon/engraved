using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Persistence;

public class SpecificCase
{
  public Metric Metric { get; set; } = null!;

  public List<Measurement> Measurements { get; } = new();
}

public static class SpecificCases
{
  public static SpecificCase GetMigraineMedicineCase()
  {
    return new SpecificCase
    {
      Metric = new Metric
      {
        Name = "Migraine Medicine",
        Description = "How many migraine medicines have been taken.",
        Key = "migraine-medicine",
        Type = MetricType.Counter
      },
      Measurements =
      {
        new Measurement
        {
          MetricKey = "migraine-medicine",
          Value = 1,
          DateTime = DateTime.UtcNow.AddDays(-30)
        },
        new Measurement
        {
          MetricKey = "migraine-medicine",
          Value = 1,
          DateTime = DateTime.UtcNow.AddDays(-28)
        },
        new Measurement
        {
          MetricKey = "migraine-medicine",
          Value = 1,
          DateTime = DateTime.UtcNow.AddDays(-10)
        },
        new Measurement
        {
          MetricKey = "migraine-medicine",
          Value = 1,
          DateTime = DateTime.UtcNow.AddDays(-5)
        }
      }
    };
  }
}
