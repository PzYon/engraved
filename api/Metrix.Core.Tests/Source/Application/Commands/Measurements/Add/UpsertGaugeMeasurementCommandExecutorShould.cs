using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Metrix.Core.Application.Commands.Measurements.Add.Gauge;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using NUnit.Framework;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public class UpsertGaugeMeasurementCommandExecutorShould
{
  private TestRepository _testRepository = null!;

  [SetUp]
  public void SetUp()
  {
    _testRepository = new TestRepository();
  }

  [Test]
  [TestCase(0)]
  [TestCase(1)]
  [TestCase(123.456)]
  public async Task Set_ValueFromCommand(double value)
  {
    _testRepository.Metrics.Add(new GaugeMetric { Id = "k3y" });

    var command = new UpsertGaugeMeasurementCommand
    {
      MetricId = "k3y",
      Value = value
    };

    CommandResult commandResult = await new UpsertGaugeMeasurementCommandExecutor(command).Execute(
      _testRepository,
      new FakeDateService()
    );

    Assert.IsFalse(string.IsNullOrEmpty(commandResult.EntityId));

    Assert.AreEqual(1, _testRepository.Measurements.Count);

    IMeasurement createdMeasurement = _testRepository.Measurements.First();
    Assert.AreEqual(command.MetricId, createdMeasurement.MetricId);

    var counterMeasurement = createdMeasurement as GaugeMeasurement;
    Assert.IsNotNull(counterMeasurement);
    Assert.AreEqual(value, counterMeasurement!.Value);
  }

  [Test]
  public void Throw_WhenNoValueIsSpecified()
  {
    _testRepository.Metrics.Add(new GaugeMetric { Id = "k3y" });

    var command = new UpsertGaugeMeasurementCommand
    {
      MetricId = "k3y",
      Notes = "n0t3s",
      Value = null
    };

    Assert.ThrowsAsync<InvalidCommandException>(
      async () =>
      {
        await new UpsertGaugeMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());
      }
    );
  }

  [Test]
  public async Task MapAllFieldsCorrectly()
  {
    _testRepository.Metrics.Add(
      new GaugeMetric
      {
        Id = "k3y",
        Attributes =
        {
          {
            "stuff",
            new MetricAttribute
            {
              Name = "Stuff",
              Values = { { "x", "y" }, { "k3y", "v@lue" } }
            }
          }
        }
      }
    );

    const double value = 123.45;

    var command = new UpsertGaugeMeasurementCommand
    {
      MetricId = "k3y",
      Notes = "n0t3s",
      Value = value,
      MetricAttributeValues = new Dictionary<string, string[]>
      {
        {
          "stuff", new[] { "k3y" }
        }
      }
    };

    await new UpsertGaugeMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());

    Assert.AreEqual(1, _testRepository.Measurements.Count);

    IMeasurement createdMeasurement = _testRepository.Measurements.First();
    Assert.AreEqual(command.MetricId, createdMeasurement.MetricId);
    Assert.AreEqual(command.Notes, createdMeasurement.Notes);

    // TODO: compare correctly!
    // Assert.AreEqual(command.MetricFlagKeys, createdMeasurement.MetricFlagKeys);

    var gaugeMeasurement = createdMeasurement as GaugeMeasurement;
    Assert.IsNotNull(gaugeMeasurement);
    Assert.AreEqual(value, gaugeMeasurement!.Value);
  }

  // TODO: Add test for value key
  [Test]
  public void Throw_WhenMetricAttributeKeyDoesNotExistOnMetric()
  {
    _testRepository.Metrics.Add(new GaugeMetric { Id = "k3y" });

    var command = new UpsertGaugeMeasurementCommand
    {
      MetricId = "k3y",
      Notes = "n0t3s",
      Value = 42,
      MetricAttributeValues = new Dictionary<string, string[]> { { "fooBar", new[] { "x" } } }
    };

    Assert.ThrowsAsync<InvalidCommandException>(
      async () =>
      {
        await new UpsertGaugeMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());
      }
    );
  }
}
