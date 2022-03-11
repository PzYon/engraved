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
  private TestDb testDb;

  [TestInitialize]
  public void SetUp()
  {
    testDb = new TestDb();
  }

  [TestMethod]
  [ExpectedException(typeof(InvalidCommandException))]
  public void Throw_WhenMetricKeyIsNotSpecified()
  {
    var command = new AddMeasurementCommand { MetricKey = string.Empty };

    new AddMeasurementCommandExecutor(command).Execute(testDb);
  }

  [TestMethod]
  [ExpectedException(typeof(InvalidCommandException))]
  public void Throw_WhenMetricDoesNotExist()
  {
    var command = new AddMeasurementCommand
    {
      MetricKey = "k3y",
      Notes = "n0t3s",
      Value = 42
    };

    new AddMeasurementCommandExecutor(command).Execute(testDb);
  }

  [TestMethod]
  public void Set_Value1_WhenTypeIsCounter()
  {
    testDb.Metrics.Add(
      new Metric
      {
        Key = "k3y",
        Type = MetricType.Counter
      }
    );

    var command = new AddMeasurementCommand
    {
      MetricKey = "k3y",
      Notes = "n0t3s"
    };

    new AddMeasurementCommandExecutor(command).Execute(testDb);

    Assert.AreEqual(1, testDb.Measurements.Count);

    Measurement createdMeasurement = testDb.Measurements.First();
    Assert.AreEqual(command.MetricKey, createdMeasurement.MetricKey);
    Assert.AreEqual(command.Notes, createdMeasurement.Notes);
    Assert.AreEqual(1, createdMeasurement.Value);
  }

  [TestMethod]
  public void Set_ValueFromCommand_WhenTypeIsGauge()
  {
    testDb.Metrics.Add(
      new Metric
      {
        Key = "k3y",
        Type = MetricType.Gauge
      }
    );

    var command = new AddMeasurementCommand
    {
      MetricKey = "k3y",
      Notes = "n0t3s",
      Value = 123.45
    };

    new AddMeasurementCommandExecutor(command).Execute(testDb);

    Assert.AreEqual(1, testDb.Measurements.Count);

    Measurement createdMeasurement = testDb.Measurements.First();
    Assert.AreEqual(command.MetricKey, createdMeasurement.MetricKey);
    Assert.AreEqual(command.Notes, createdMeasurement.Notes);
    Assert.AreEqual(123.45, createdMeasurement.Value);
  }

  [TestMethod]
  [ExpectedException(typeof(InvalidCommandException))]
  public void Throw_WhenTypeIsGaugeAndValueIsNull()
  {
    testDb.Metrics.Add(
      new Metric
      {
        Key = "k3y",
        Type = MetricType.Gauge
      }
    );

    var command = new AddMeasurementCommand
    {
      MetricKey = "k3y",
      Value = null
    };

    new AddMeasurementCommandExecutor(command).Execute(testDb);
  }

  private class TestDb : IDb
  {
    public List<Measurement> Measurements { get; } = new();

    public List<Metric> Metrics { get; } = new();
  }
}
