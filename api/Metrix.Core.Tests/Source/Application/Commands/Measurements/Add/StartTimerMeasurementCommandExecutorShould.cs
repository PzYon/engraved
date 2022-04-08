using System;
using System.Linq;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Metrix.Core.Application.Commands.Measurements.Add;

[TestClass]
public class StartTimerMeasurementCommandExecutorShould
{
  private TestDb _testDb = null!;

  [TestInitialize]
  public void SetUp()
  {
    _testDb = new TestDb();
  }

  [TestMethod]
  [ExpectedException(typeof(InvalidCommandException))]
  public void Throw_WhenMetricAlreadyHasRunningTimer()
  {
    _testDb.Metrics.Add(new TimerMetric { Key = "test" });

    _testDb.Measurements.Add(
      new TimerMeasurement
      {
        MetricKey = "test",
        DateTime = DateTime.Now,
        StartDate = DateTime.Now.AddMinutes(23)
      }
    );

    var command = new StartTimerMeasurementCommand { MetricKey = "test" };

    new StartTimerMeasurementCommandExecutor(command).Execute(_testDb);
  }

  [TestMethod]
  public void CreateTimerMeasurement()
  {
    _testDb.Metrics.Add(new TimerMetric { Key = "test" });

    var command = new StartTimerMeasurementCommand { MetricKey = "test" };

    new StartTimerMeasurementCommandExecutor(command).Execute(_testDb);

    Assert.AreEqual(1, _testDb.Measurements.Count);

    IMeasurement createdMeasurement = _testDb.Measurements.First();
    Assert.AreEqual(command.MetricKey, createdMeasurement.MetricKey);

    var counterMeasurement = createdMeasurement as TimerMeasurement;
    Assert.IsNotNull(counterMeasurement);
    Assert.IsNotNull(counterMeasurement.StartDate);

    TimeSpan diffBetweenNow = counterMeasurement.StartDate - DateTime.UtcNow;
    Assert.IsTrue(diffBetweenNow.TotalSeconds < 5);

    Assert.IsNull(counterMeasurement.EndDate);

    TimerMetric metric = _testDb.Metrics.OfType<TimerMetric>().First(m => m.Key == "test");
    Assert.IsNotNull(metric);
    Assert.IsNotNull(metric.StartDate);
    Assert.AreEqual(counterMeasurement.StartDate, metric.StartDate);
  }
}
