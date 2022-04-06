using System.Linq;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Metrix.Core.Application.Commands.Measurements.Add;

[TestClass]
public class AddCounterMeasurementCommandExecutorShould
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



}