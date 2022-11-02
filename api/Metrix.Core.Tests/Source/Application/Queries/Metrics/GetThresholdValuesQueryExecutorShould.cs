using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Metrix.Core.Application.Persistence.Demo;
using Metrix.Core.Application.Queries.Metrics.GetThresholdValues;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using NUnit.Framework;

namespace Metrix.Core.Application.Queries.Metrics;

public class GetThresholdValuesQueryExecutorShould
{
  private const string MetricId = "metric-id";

  private InMemoryRepository _testRepository = null!;

  [SetUp]
  public void SetUp()
  {
    _testRepository = new InMemoryRepository();
  }

  [Test]
  public async Task DoSomething()
  {
    _testRepository.Metrics.Add(
      new GaugeMetric
      {
        Id = MetricId,
        Attributes = new Dictionary<string, MetricAttribute>
        {
          {
            "colors",
            new MetricAttribute
            {
              Name = "Colors",
              Values = new Dictionary<string, string> { { "blue", "Blue" }, { "green", "Green" } }
            }
          }
        },
        Thresholds = new Dictionary<string, Dictionary<string, double>>
        {
          { "colors", new Dictionary<string, double> { { "green", 1 }, { "blue", 1 } } }
        }
      }
    );

    AddMeasurement(2, "blue");
    AddMeasurement(5, "blue");
    AddMeasurement(3, "green");
    AddMeasurement(3, "blue");

    IDictionary<string, IDictionary<string, double>> results = await new GetThresholdValuesQuery
      {
        FromDate = DateTime.UtcNow.AddHours(-1),
        ToDate = DateTime.UtcNow.AddHours(1),
        MetricId = MetricId
      }
      .CreateExecutor()
      .Execute(_testRepository);

    Assert.NotNull(results);

    Assert.That(results.ContainsKey("colors"));
    IDictionary<string, double> colorsThresholds = results["colors"];
    Assert.NotNull(colorsThresholds);

    Assert.AreEqual(2, colorsThresholds.Count);
    Assert.That(colorsThresholds.ContainsKey("blue"));
    Assert.AreEqual(10, colorsThresholds["blue"]);

    Assert.That(colorsThresholds.ContainsKey("green"));
    Assert.AreEqual(3, colorsThresholds["green"]);
  }

  private void AddMeasurement(int value, string attributeValueKey)
  {
    _testRepository.Measurements.Add(
      new GaugeMeasurement
      {
        MetricId = MetricId,
        DateTime = DateTime.UtcNow,
        Value = value,
        MetricAttributeValues = new Dictionary<string, string[]>
        {
          { "colors", new[] { attributeValueKey } }
        }
      }
    );
  }
}
