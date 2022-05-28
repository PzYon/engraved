using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Persistence.Demo;

public class SpecificCase
{
  public IMetric Metric { get; set; } = null!;

  public List<IMeasurement> Measurements { get; } = new();
}

public static class SpecificCases
{
  public static SpecificCase GetOffByOneEdgeCase()
  {
    return new SpecificCase
    {
      Metric = new CounterMetric
      {
        Name = "Date Edge Case"
      },
      Measurements =
      {
        new CounterMeasurement
        {
          DateTime = new DateTime(2022, 3, 31, 21, 23, 0, DateTimeKind.Utc)
        },
        new CounterMeasurement
        {
          DateTime = new DateTime(2022, 4, 1, 2, 1, 0, DateTimeKind.Utc)
        }
      }
    };
  }

  public static SpecificCase GetMigraineMedicineCase()
  {
    const string irfenKey = "irf";
    const string eletriptanKey = "ele";
    const string imigranKey = "imi";

    return new SpecificCase
    {
      Metric = new CounterMetric
      {
        Name = "Migraine Medicine",
        Description = "How many migraine medicines have been taken.",
        Attributes = new Dictionary<string, MetricAttribute>
        {
          {
            "medicine",
            new MetricAttribute
            {
              Name = "Medicine Type",
              Values =
              {
                { irfenKey, "Irfen" },
                { eletriptanKey, "Eletriptan" },
                { imigranKey, "Imigran" }
              }
            }
          }
        }
      },
      Measurements =
      {
        new CounterMeasurement
        {
          DateTime = DateTime.UtcNow.AddDays(-30),
          MetricFlagKeys = new Dictionary<string, string[]> { { "medicine", new[] { eletriptanKey } } }
        },
        new CounterMeasurement
        {
          DateTime = DateTime.UtcNow.AddDays(-30),
          MetricFlagKeys = new Dictionary<string, string[]> { { "medicine", new[] { irfenKey } } }
        },
        new CounterMeasurement
        {
          DateTime = DateTime.UtcNow.AddDays(-30),
          MetricFlagKeys = new Dictionary<string, string[]> { { "medicine", new[] { imigranKey } } }
        },
        new CounterMeasurement
        {
          DateTime = DateTime.UtcNow.AddDays(-30),
          MetricFlagKeys = new Dictionary<string, string[]> { { "medicine", new[] { eletriptanKey } } }
        },
        new CounterMeasurement
        {
          DateTime = DateTime.UtcNow.AddDays(-28),
          MetricFlagKeys = new Dictionary<string, string[]> { { "medicine", new[] { irfenKey } } }
        },
        new CounterMeasurement
        {
          DateTime = DateTime.UtcNow.AddDays(-10),
          MetricFlagKeys = new Dictionary<string, string[]> { { "medicine", new[] { eletriptanKey } } }
        },
        new CounterMeasurement
        {
          DateTime = DateTime.UtcNow.AddDays(-5),
          MetricFlagKeys = new Dictionary<string, string[]> { { "medicine", new[] { eletriptanKey } } }
        },
        new CounterMeasurement
        {
          DateTime = DateTime.UtcNow.AddDays(-3),
          MetricFlagKeys = new Dictionary<string, string[]> { { "medicine", new[] { imigranKey } } }
        },
        new CounterMeasurement
        {
          DateTime = DateTime.UtcNow.AddDays(-3),
          MetricFlagKeys = new Dictionary<string, string[]> { { "medicine", new[] { irfenKey } } }
        }
      }
    };
  }
}
