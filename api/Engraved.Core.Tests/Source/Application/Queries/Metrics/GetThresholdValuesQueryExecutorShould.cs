using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Application.Queries.Journals.GetThresholdValues;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;
using NUnit.Framework;

namespace Engraved.Core.Application.Queries.Metrics;

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
    _testRepository.Journals.Add(
      new GaugeJournal
      {
        Id = MetricId,
        Attributes = new Dictionary<string, JournalAttribute>
        {
          {
            "colors",
            new JournalAttribute
            {
              Name = "Colors",
              Values = new Dictionary<string, string> { { "blue", "Blue" }, { "green", "Green" } }
            }
          }
        },
        Thresholds = new Dictionary<string, Dictionary<string, double>>
        {
          { "colors", new Dictionary<string, double> { { "green", 3 }, { "blue", 6 } } }
        }
      }
    );

    AddMeasurement(2, "blue");
    AddMeasurement(5, "blue");
    AddMeasurement(4, "green");
    AddMeasurement(3, "blue");

    IDictionary<string, IDictionary<string, ThresholdResult>> results = await new GetThresholdValuesQuery
      {
        FromDate = DateTime.UtcNow.AddHours(-1),
        ToDate = DateTime.UtcNow.AddHours(1),
        JournalId = MetricId
      }
      .CreateExecutor()
      .Execute(_testRepository);

    Assert.NotNull(results);

    Assert.That(results.ContainsKey("colors"));
    IDictionary<string, ThresholdResult> colorsThresholds = results["colors"];
    Assert.NotNull(colorsThresholds);

    Assert.AreEqual(2, colorsThresholds.Count);
    Assert.That(colorsThresholds.ContainsKey("blue"));
    Assert.AreEqual(10, colorsThresholds["blue"].ActualValue);
    Assert.AreEqual(6, colorsThresholds["blue"].ThresholdValue);

    Assert.That(colorsThresholds.ContainsKey("green"));
    Assert.AreEqual(4, colorsThresholds["green"].ActualValue);
    Assert.AreEqual(3, colorsThresholds["green"].ThresholdValue);
  }

  private void AddMeasurement(int value, string attributeValueKey)
  {
    _testRepository.Measurements.Add(
      new GaugeMeasurement
      {
        ParentId = MetricId,
        DateTime = DateTime.UtcNow,
        Value = value,
        JournalAttributeValues = new Dictionary<string, string[]>
        {
          { "colors", new[] { attributeValueKey } }
        }
      }
    );
  }
}
