using System;
using System.Linq;
using System.Threading.Tasks;
using Metrix.Core.Application.Commands.Measurements.Add.Timer.End;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Metrix.Core.Application.Commands.Measurements.Add;

[TestClass]
public class EndTimerMeasurementCommandExecutorShould
{
  private TestRepository _testRepository = null!;
  private FakeDateService _fakeDateService = null!;

  [TestInitialize]
  public void SetUp()
  {
    _fakeDateService = new FakeDateService();
    _testRepository = new TestRepository();
  }

  [TestMethod]
  [ExpectedException(typeof(InvalidCommandException))]
  public async Task Throw_WhenNoTimerIsStartedForMetric()
  {
    _testRepository.Metrics.Add(new TimerMetric { Key = "test" });

    var command = new EndTimerMeasurementCommand { MetricKey = "test" };
    await new EndTimerMeasurementCommandExecutor(command).Execute(_testRepository, _fakeDateService);
  }

  [TestMethod]
  public async Task SetEndDate()
  {
    DateTime startDate = _fakeDateService.UtcNow.AddMinutes(-30);

    _testRepository.Metrics.Add(new TimerMetric { Key = "test", StartDate = startDate });

    _testRepository.Measurements.Add(
      new TimerMeasurement
      {
        DateTime = startDate,
        StartDate = startDate,
        MetricKey = "test"
      }
    );

    Assert.AreEqual(1, _testRepository.Measurements.Count);

    var command = new EndTimerMeasurementCommand { MetricKey = "test" };

    await new EndTimerMeasurementCommandExecutor(command).Execute(_testRepository, _fakeDateService);

    Assert.AreEqual(1, _testRepository.Measurements.Count);

    TimerMeasurement timerMeasurement = _testRepository.Measurements.OfType<TimerMeasurement>().First();

    Assert.IsNotNull(timerMeasurement.EndDate);

    Assert.AreEqual(_fakeDateService.UtcNow, timerMeasurement.EndDate.Value);

    TimerMetric metric = _testRepository.Metrics.OfType<TimerMetric>().First(m => m.Key == "test");
    Assert.IsNotNull(metric);
    Assert.IsNull(metric.StartDate);
  }
}
