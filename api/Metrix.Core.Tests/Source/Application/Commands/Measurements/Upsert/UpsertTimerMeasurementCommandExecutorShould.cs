using System;
using System.Threading.Tasks;
using Metrix.Core.Application.Commands.Measurements.Upsert.Timer;
using Metrix.Core.Application.Persistence.Demo;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using NUnit.Framework;

namespace Metrix.Core.Application.Commands.Measurements.Upsert;

public class UpsertTimerMeasurementCommandExecutorShould
{
  private FakeDateService _fakeDateService = null!;
  private InMemoryRepository _testRepository = null!;
  private const string MetricId = "626dab25f1a93c5c724d820a";

  [SetUp]
  public void SetUp()
  {
    _fakeDateService = new FakeDateService();
    _testRepository = new InMemoryRepository();

    _testRepository.Metrics.Add(new TimerMetric { Id = MetricId });
  }

  [Test]
  public async Task StartNewMeasurement_WhenBlankCommand()
  {
    var command = new UpsertTimerMeasurementCommand { MetricId = MetricId };

    CommandResult result =
      await new UpsertTimerMeasurementCommandExecutor(command).Execute(_testRepository, _fakeDateService);

    Assert.IsNotNull(result.EntityId);
    Assert.AreEqual(1, _testRepository.Measurements.Count);
    var measurement = await _testRepository.GetMeasurement(result.EntityId) as TimerMeasurement;

    Assert.IsNotNull(measurement);
    Assert.AreEqual(_fakeDateService.UtcNow, measurement?.StartDate);
  }

  [Test]
  public async Task EndExistingMeasurement_WhenBlankCommand()
  {
    _testRepository.Measurements.Add(
      new TimerMeasurement
      {
        Id = Guid.NewGuid().ToString("N"),
        MetricId = MetricId,
        StartDate = _fakeDateService.UtcNow.AddMinutes(-10)
      }
    );

    Assert.AreEqual(1, _testRepository.Measurements.Count);

    var command = new UpsertTimerMeasurementCommand { MetricId = MetricId };

    CommandResult result =
      await new UpsertTimerMeasurementCommandExecutor(command).Execute(_testRepository, _fakeDateService);

    Assert.IsNotNull(result.EntityId);
    Assert.AreEqual(1, _testRepository.Measurements.Count);
    var measurement = await _testRepository.GetMeasurement(result.EntityId) as TimerMeasurement;

    Assert.IsNotNull(measurement);
    Assert.AreEqual(_fakeDateService.UtcNow, measurement?.EndDate);
  }

  [Test]
  public async Task UpdateExistingMeasurement_WithValuesFromCommand()
  {
    var measurementId = Guid.NewGuid().ToString("N");

    _testRepository.Measurements.Add(
      new TimerMeasurement
      {
        Id = measurementId,
        MetricId = MetricId,
        StartDate = _fakeDateService.UtcNow.AddMinutes(-50),
        EndDate = _fakeDateService.UtcNow.AddMinutes(-10)
      }
    );

    Assert.AreEqual(1, _testRepository.Measurements.Count);

    DateTime newStartDate = _fakeDateService.UtcNow.AddMinutes(-30);
    DateTime? newEndDate = null;

    var command = new UpsertTimerMeasurementCommand
    {
      Id = measurementId,
      MetricId = MetricId,
      StartDate = newStartDate,
      EndDate = newEndDate
    };

    CommandResult result =
      await new UpsertTimerMeasurementCommandExecutor(command).Execute(_testRepository, _fakeDateService);

    Assert.IsNotNull(result.EntityId);
    Assert.AreEqual(1, _testRepository.Measurements.Count);
    var measurement = await _testRepository.GetMeasurement(result.EntityId) as TimerMeasurement;

    Assert.IsNotNull(measurement);
    Assert.AreEqual(newStartDate, measurement?.StartDate);
    Assert.AreEqual(newStartDate, measurement?.DateTime);
    Assert.AreEqual(newEndDate, measurement?.EndDate);
  }
}
