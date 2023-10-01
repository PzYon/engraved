using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands.Measurements.Upsert.Timer;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Measurements.Upsert;

public class UpsertTimerMeasurementCommandExecutorShould
{
  private FakeDateService _fakeDateService = null!;
  private InMemoryRepository _testRepository = null!;
  private const string JournalId = "626dab25f1a93c5c724d820a";

  [SetUp]
  public void SetUp()
  {
    _fakeDateService = new FakeDateService();
    _testRepository = new InMemoryRepository();

    _testRepository.Journals.Add(new TimerJournal { Id = JournalId });
  }

  [Test]
  public async Task SaveNewMeasurement()
  {
    DateTime startDate = _fakeDateService.UtcNow.AddHours(-1);
    DateTime endDate = _fakeDateService.UtcNow.AddHours(+1);

    var command = new UpsertTimerMeasurementCommand
    {
      JournalId = JournalId,
      StartDate = startDate,
      EndDate = endDate
    };

    CommandResult result =
      await new UpsertTimerMeasurementCommandExecutor(command).Execute(_testRepository, _fakeDateService);

    Assert.IsNotNull(result.EntityId);
    Assert.AreEqual(1, _testRepository.Measurements.Count);

    var measurement = await _testRepository.GetMeasurement(result.EntityId) as TimerMeasurement;

    Assert.IsNotNull(measurement);
    Assert.AreEqual(startDate, measurement!.StartDate);
    Assert.AreEqual(endDate, measurement.EndDate);
  }

  [Test]
  public async Task StartNewMeasurement_WhenBlankCommand()
  {
    var command = new UpsertTimerMeasurementCommand { JournalId = JournalId };

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
        ParentId = JournalId,
        StartDate = _fakeDateService.UtcNow.AddMinutes(-10)
      }
    );

    Assert.AreEqual(1, _testRepository.Measurements.Count);

    var command = new UpsertTimerMeasurementCommand { JournalId = JournalId };

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
        ParentId = JournalId,
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
      JournalId = JournalId,
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
