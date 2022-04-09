using System.Linq;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Metrix.Core.Application.Commands.Measurements.Add;

[TestClass]
public class AddGaugeMeasurementCommandExecutorShould
{
  private TestDb _testDb = null!;

  [TestInitialize]
  public void SetUp()
  {
    _testDb = new TestDb();
  }

  [TestMethod]
  [DataRow(0)]
  [DataRow(1)]
  [DataRow(123.456)]
  public void Set_ValueFromCommand(double value)
  {
    _testDb.Metrics.Add(new GaugeMetric { Key = "k3y" });

    var command = new AddGaugeMeasurementCommand
    {
      MetricKey = "k3y",
      Value = value
    };

    new AddGaugeMeasurementCommandExecutor(command).Execute(_testDb, new FakeDateService());

    Assert.AreEqual(1, _testDb.Measurements.Count);

    IMeasurement createdMeasurement = _testDb.Measurements.First();
    Assert.AreEqual(command.MetricKey, createdMeasurement.MetricKey);

    var counterMeasurement = createdMeasurement as GaugeMeasurement;
    Assert.IsNotNull(counterMeasurement);
    Assert.AreEqual(value, counterMeasurement.Value);
  }

  [TestMethod]
  [ExpectedException(typeof(InvalidCommandException))]
  public void Throw_WhenNoValueIsSpecified()
  {
    _testDb.Metrics.Add(new GaugeMetric { Key = "k3y" });

    var command = new AddGaugeMeasurementCommand
    {
      MetricKey = "k3y",
      Notes = "n0t3s",
      Value = null
    };

    new AddGaugeMeasurementCommandExecutor(command).Execute(_testDb, new FakeDateService());
  }

  [TestMethod]
  public void MapAllFieldsCorrectly()
  {
    _testDb.Metrics.Add(
      new GaugeMetric
      {
        Key = "k3y",
        Flags = { { "x", "y" }, { "k3y", "v@lue" } }
      }
    );

    const double value = 123.45;

    var command = new AddGaugeMeasurementCommand
    {
      MetricKey = "k3y",
      Notes = "n0t3s",
      Value = value,
      MetricFlagKey = "k3y"
    };

    new AddGaugeMeasurementCommandExecutor(command).Execute(_testDb, new FakeDateService());

    Assert.AreEqual(1, _testDb.Measurements.Count);

    IMeasurement createdMeasurement = _testDb.Measurements.First();
    Assert.AreEqual(command.MetricKey, createdMeasurement.MetricKey);
    Assert.AreEqual(command.Notes, createdMeasurement.Notes);
    Assert.AreEqual(command.MetricFlagKey, createdMeasurement.MetricFlagKey);

    var gaugeMeasurement = createdMeasurement as GaugeMeasurement;
    Assert.IsNotNull(gaugeMeasurement);
    Assert.AreEqual(value, gaugeMeasurement.Value);
  }

  [TestMethod]
  [ExpectedException(typeof(InvalidCommandException))]
  public void Throw_WhenMetricFlagKeyDoesNotExistOnMetric()
  {
    _testDb.Metrics.Add(new GaugeMetric { Key = "k3y" });

    var command = new AddGaugeMeasurementCommand
    {
      MetricKey = "k3y",
      Notes = "n0t3s",
      Value = 42,
      MetricFlagKey = "fooBar"
    };

    new AddGaugeMeasurementCommandExecutor(command).Execute(_testDb, new FakeDateService());
  }
}
