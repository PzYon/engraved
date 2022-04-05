using System.Collections.Generic;
using System.Linq;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Metrix.Core.Application.Commands.Measurements.Add;

[TestClass]
public class AddMeasurementCommandExecutorShould
{
  private TestDb _testDb = null!;

  [TestInitialize]
  public void SetUp()
  {
    _testDb = new TestDb();
  }

  [TestMethod]
  [ExpectedException(typeof(InvalidCommandException))]
  public void Throw_WhenMetricKeyIsNotSpecified()
  {
    var command = new AddCounterMeasurementCommand { MetricKey = string.Empty };

    new AddCounterMeasurementCommandExecutor(command).Execute(_testDb);
  }

  [TestMethod]
  [ExpectedException(typeof(InvalidCommandException))]
  public void Throw_WhenMetricDoesNotExist()
  {
    var command = new AddCounterMeasurementCommand
    {
      MetricKey = "k3y",
      Notes = "n0t3s"
    };

    new AddCounterMeasurementCommandExecutor(command).Execute(_testDb);
  }

  [TestMethod]
  [DataRow(null)]
  [DataRow(0)]
  [DataRow(1)]
  [DataRow(2)]
  public void Set_Value1_WhenTypeIsCounter(int? value)
  {
    _testDb.Metrics.Add(
      new Metric
      {
        Key = "k3y",
        Type = MetricType.Counter
      }
    );

    var command = new AddCounterMeasurementCommand { MetricKey = "k3y" };

    new AddCounterMeasurementCommandExecutor(command).Execute(_testDb);

    Assert.AreEqual(1, _testDb.Measurements.Count);

    BaseMeasurement createdMeasurement = _testDb.Measurements.First();
    Assert.AreEqual(command.MetricKey, createdMeasurement.MetricKey);

    var counterMeasurement = createdMeasurement as CounterMeasurement;
    Assert.IsNotNull(counterMeasurement);
  }

  [TestMethod]
  public void Set_ValueFromCommand_WhenTypeIsGauge()
  {
    _testDb.Metrics.Add(
      new Metric
      {
        Key = "k3y",
        Type = MetricType.Gauge
      }
    );

    var command = new AddGaugeMeasurementCommand
    {
      MetricKey = "k3y",
      Value = 123.45
    };

    new AddGaugeMeasurementCommandExecutor(command).Execute(_testDb);

    Assert.AreEqual(1, _testDb.Measurements.Count);

    BaseMeasurement createdMeasurement = _testDb.Measurements.First();
    Assert.AreEqual(command.MetricKey, createdMeasurement.MetricKey);

    var counterMeasurement = createdMeasurement as GaugeMeasurement;
    Assert.IsNotNull(counterMeasurement);
    Assert.AreEqual(123.45, counterMeasurement.Value);
  }

  [TestMethod]
  public void MapAllFieldsCorrectly()
  {
    _testDb.Metrics.Add(
      new Metric
      {
        Key = "k3y",
        Type = MetricType.Gauge,
        Flags = { { "x", "y" }, { "k3y", "v@lue" } }
      }
    );

    var command = new AddGaugeMeasurementCommand
    {
      MetricKey = "k3y",
      Notes = "n0t3s",
      Value = 123.45,
      MetricFlagKey = "k3y"
    };

    new AddGaugeMeasurementCommandExecutor(command).Execute(_testDb);

    Assert.AreEqual(1, _testDb.Measurements.Count);

    BaseMeasurement createdMeasurement = _testDb.Measurements.First();
    Assert.AreEqual(command.MetricKey, createdMeasurement.MetricKey);
    Assert.AreEqual(command.Notes, createdMeasurement.Notes);
    Assert.AreEqual(command.MetricFlagKey, createdMeasurement.MetricFlagKey);
  }

  [TestMethod]
  [ExpectedException(typeof(InvalidCommandException))]
  public void Throw_WhenMetricFlagKeyDoesNotExistOnMetric()
  {
    _testDb.Metrics.Add(
      new Metric
      {
        Key = "k3y"
      }
    );

    var command = new AddGaugeMeasurementCommand
    {
      MetricKey = "k3y",
      Notes = "n0t3s",
      Value = 42,
      MetricFlagKey = "fooBar"
    };

    new AddGaugeMeasurementCommandExecutor(command).Execute(_testDb);
  }

  private class TestDb : IDb
  {
    public List<BaseMeasurement> Measurements { get; } = new();

    public List<Metric> Metrics { get; } = new();
  }
}
