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
    _testRepository.Metrics.Add(new TimerMetric { Id = "test" });

    _testRepository.Measurements.Add(
      new TimerMeasurement
      {
        MetricId = "test",
        DateTime = DateTime.Now,
        StartDate = DateTime.Now.AddMinutes(23)
      }
    );

    var command = new StartTimerMeasurementCommand { Id = "626dab25f1a93c5c724d820a", MetricId = "test" };

    await new StartTimerMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());
  }

  [TestMethod]
  public async Task CreateTimerMeasurement()
  {
    _testRepository.Metrics.Add(new TimerMetric { Id = "test" });

    var command = new StartTimerMeasurementCommand { MetricId = "test" };

    await new StartTimerMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());

    Assert.AreEqual(1, _testRepository.Measurements.Count);

    IMeasurement createdMeasurement = _testRepository.Measurements.First();
    Assert.AreEqual(command.MetricId, createdMeasurement.MetricId);

    var counterMeasurement = createdMeasurement as TimerMeasurement;
    Assert.IsNotNull(counterMeasurement);
    Assert.IsNotNull(counterMeasurement.StartDate);

    TimeSpan diffBetweenNow = counterMeasurement.StartDate - DateTime.UtcNow;
    Assert.IsTrue(diffBetweenNow.TotalSeconds < 5);

    Assert.IsNull(counterMeasurement.EndDate);

    TimerMetric metric = _testRepository.Metrics.OfType<TimerMetric>().First(m => m.Id == "test");
    Assert.IsNotNull(metric);
    Assert.IsNotNull(metric.StartDate);
    Assert.AreEqual(counterMeasurement.StartDate, metric.StartDate);
  }
}
