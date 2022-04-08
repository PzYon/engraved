using System;
using System.Linq;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Metrix.Core.Application.Commands.Measurements.Add;

[TestClass]
public class EndTimerMeasurementCommandExecutorShould
{
  private TestDb _testDb = null!;

  [TestInitialize]
  public void SetUp()
  {
    _testDb = new TestDb();
  }

  [TestMethod]
  [ExpectedException(typeof(InvalidCommandException))]
  public void Throw_WhenNoTimerIsStartedForMetric()
  {
    _testDb.Metrics.Add(new TimerMetric { Key = "test" });

    var command = new EndTimerMeasurementCommand { MetricKey = "test" };
    new EndTimerMeasurementCommandExecutor(command).Execute(_testDb);
  }

  [TestMethod]
  public void SetEndDate()
  {
    DateTime startDate = DateTime.UtcNow.AddMinutes(-30);

    _testDb.Metrics.Add(new TimerMetric { Key = "test", StartDate = startDate });

    _testDb.Measurements.Add(
      new TimerMeasurement
      {
        DateTime = startDate,
        StartDate = startDate,
        MetricKey = "test"
      }
    );

    Assert.AreEqual(1, _testDb.Measurements.Count);

    var command = new EndTimerMeasurementCommand { MetricKey = "test" };

    new EndTimerMeasurementCommandExecutor(command).Execute(_testDb);

    Assert.AreEqual(1, _testDb.Measurements.Count);

    TimerMeasurement timerMeasurement = _testDb.Measurements.OfType<TimerMeasurement>().First();

    Assert.IsNotNull(timerMeasurement.EndDate);

    TimeSpan diffBetweenNow = timerMeasurement.EndDate.Value - DateTime.Now;
    Assert.IsTrue(diffBetweenNow.TotalSeconds < 5);

    TimerMetric metric = _testDb.Metrics.OfType<TimerMetric>().First(m => m.Key == "test");
    Assert.IsNotNull(metric);
    Assert.IsNull(metric.StartDate);
  }
}
