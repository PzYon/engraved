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
    const string irfenKey = "irf";
    const string eletriptanKey = "ele";
    
    return new SpecificCase
    {
      Metric = new Metric
      {
        Key = "migraine-medicine",
        Name = "Migraine Medicine",
        Description = "How many migraine medicines have been taken.",
        Type = MetricType.Counter,
        Flags = new Dictionary<string, string>
        {
          { irfenKey, "Irfen" },
          { eletriptanKey, "Eletriptan" },
        }
      },
      Measurements =
      {
        new Measurement
        {
          MetricKey = "migraine-medicine",
          Value = 1,
          DateTime = DateTime.UtcNow.AddDays(-30),
          MetricFlagKey = eletriptanKey
        },
        new Measurement
        {
          MetricKey = "migraine-medicine",
          Value = 1,
          DateTime = DateTime.UtcNow.AddDays(-30),
          MetricFlagKey = irfenKey
        },
        new Measurement
        {
          MetricKey = "migraine-medicine",
          Value = 1,
          DateTime = DateTime.UtcNow.AddDays(-30),
          MetricFlagKey = eletriptanKey
        },
        new Measurement
        {
          MetricKey = "migraine-medicine",
          Value = 1,
          DateTime = DateTime.UtcNow.AddDays(-28),
          MetricFlagKey = irfenKey
        },
        new Measurement
        {
          MetricKey = "migraine-medicine",
          Value = 1,
          DateTime = DateTime.UtcNow.AddDays(-10),
          MetricFlagKey = eletriptanKey
        },
        new Measurement
        {
          MetricKey = "migraine-medicine",
          Value = 1,
          DateTime = DateTime.UtcNow.AddDays(-5),
          MetricFlagKey = eletriptanKey
        }
      }
    };
  }
}
