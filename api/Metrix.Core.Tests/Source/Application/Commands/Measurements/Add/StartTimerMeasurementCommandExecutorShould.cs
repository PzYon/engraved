using System;
using System.Linq;
using System.Threading.Tasks;
using Metrix.Core.Application.Commands.Measurements.Add.Timer.Start;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Metrix.Core.Application.Commands.Measurements.Add;

[TestClass]
public class StartTimerMeasurementCommandExecutorShould
{
  private TestRepository _testRepository = null!;

  [TestInitialize]
  public void SetUp()
  {
    _testRepository = new TestRepository();
  }

  [TestMethod]
  [ExpectedException(typeof(InvalidCommandException))]
  public async Task Throw_WhenMetricAlreadyHasRunningTimer()
  {
    _testRepository.Metrics.Add(new TimerMetric { Key = "test" });

    _testRepository.Measurements.Add(
      new TimerMeasurement
      {
        MetricKey = "test",
        DateTime = DateTime.Now,
        StartDate = DateTime.Now.AddMinutes(23)
      }
    );

    var command = new StartTimerMeasurementCommand { MetricKey = "test" };

    await new StartTimerMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());
  }

  [TestMethod]
  public async Task CreateTimerMeasurement()
  {
    _testRepository.Metrics.Add(new TimerMetric { Key = "test" });

    var command = new StartTimerMeasurementCommand { MetricKey = "test" };

    await new StartTimerMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());

    Assert.AreEqual(1, _testRepository.Measurements.Count);

    IMeasurement createdMeasurement = _testRepository.Measurements.First();
    Assert.AreEqual(command.MetricKey, createdMeasurement.MetricKey);

    var counterMeasurement = createdMeasurement as TimerMeasurement;
    Assert.IsNotNull(counterMeasurement);
    Assert.IsNotNull(counterMeasurement.StartDate);

    TimeSpan diffBetweenNow = counterMeasurement.StartDate - DateTime.UtcNow;
    Assert.IsTrue(diffBetweenNow.TotalSeconds < 5);

    Assert.IsNull(counterMeasurement.EndDate);

    TimerMetric metric = _testRepository.Metrics.OfType<TimerMetric>().First(m => m.Key == "test");
    Assert.IsNotNull(metric);
    Assert.IsNotNull(metric.StartDate);
    Assert.AreEqual(counterMeasurement.StartDate, metric.StartDate);
  }
}
