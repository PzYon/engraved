﻿using System;
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
    _testRepository.Metrics.Add(new TimerMetric { Id = "626dab25f1a93c5c724d820a" });

    var command = new EndTimerMeasurementCommand { MetricId = "test" };
    await new EndTimerMeasurementCommandExecutor(command).Execute(_testRepository, _fakeDateService);
  }

  [TestMethod]
  public async Task SetEndDate()
  {
    DateTime startDate = _fakeDateService.UtcNow.AddMinutes(-30);

    _testRepository.Metrics.Add(new TimerMetric { Id = "test", StartDate = startDate });

    _testRepository.Measurements.Add(
      new TimerMeasurement
      {
        Id = "626dab25f1a93c5c724d820a",
        DateTime = startDate,
        StartDate = startDate,
        MetricId = "test"
      }
    );

    Assert.AreEqual(1, _testRepository.Measurements.Count);

    var command = new EndTimerMeasurementCommand { MetricId = "test" };

    await new EndTimerMeasurementCommandExecutor(command).Execute(_testRepository, _fakeDateService);

    Assert.AreEqual(1, _testRepository.Measurements.Count);

    TimerMeasurement timerMeasurement = _testRepository.Measurements.OfType<TimerMeasurement>().First();

    Assert.IsNotNull(timerMeasurement.EndDate);

    Assert.AreEqual(_fakeDateService.UtcNow, timerMeasurement.EndDate.Value);

    TimerMetric metric = _testRepository.Metrics.OfType<TimerMetric>().First(m => m.Id == "test");
    Assert.IsNotNull(metric);
    Assert.IsNull(metric.StartDate);
  }
}
