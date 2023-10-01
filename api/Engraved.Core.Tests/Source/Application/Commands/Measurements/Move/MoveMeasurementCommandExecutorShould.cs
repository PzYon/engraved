using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Measurements.Move;

public class MoveMeasurementCommandExecutorShould
{
  private InMemoryRepository _repo = null!;
  private FakeDateService _dateService = null!;

  [SetUp]
  public void SetUp()
  {
    _repo = new InMemoryRepository();
    _dateService = new FakeDateService(DateTime.UtcNow.AddDays(-10));
  }

  [Test]
  public async Task MoveEntryToOtherJournal()
  {
    // given: source
    _repo.Journals.Add(new CounterJournal { Id = "source-journal-id" });
    _repo.Measurements.Add(
      new CounterMeasurement
      {
        Id = "measurement-id",
        ParentId = "source-journal-id",
        DateTime = _dateService.UtcNow
      }
    );
    IMeasurement[] sourceMeasurements = await _repo.GetAllMeasurements("source-journal-id", null, null, null);
    Assert.AreEqual(1, sourceMeasurements.Length);

    // given: target
    _repo.Journals.Add(new CounterJournal { Id = "target-journal-id" });
    IMeasurement[] targetMeasurements = await _repo.GetAllMeasurements("target-journal-id", null, null, null);
    Assert.AreEqual(0, targetMeasurements.Length);

    // when
    await new MoveMeasurementCommandExecutor(
      new MoveMeasurementCommand
      {
        MeasurementId = "measurement-id",
        TargetJournalId = "target-journal-id"
      }
    ).Execute(_repo, _dateService);

    // then
    targetMeasurements = await _repo.GetAllMeasurements("target-journal-id", null, null, null);
    Assert.AreEqual(1, targetMeasurements.Length);

    sourceMeasurements = await _repo.GetAllMeasurements("source-journal-id", null, null, null);
    Assert.AreEqual(0, sourceMeasurements.Length);
  }
}
