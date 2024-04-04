using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands.Entries.Upsert.Timer;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Entries.Upsert;

public class UpsertTimerEntryCommandExecutorShould
{
  private const string JournalId = "626dab25f1a93c5c724d820a";
  private FakeDateService _fakeDateService = null!;
  private InMemoryRepository _testRepository = null!;

  [SetUp]
  public void SetUp()
  {
    _fakeDateService = new FakeDateService();
    _testRepository = new InMemoryRepository();

    _testRepository.Journals.Add(new TimerJournal { Id = JournalId });
  }

  [Test]
  public async Task SaveNewEntry()
  {
    DateTime startDate = _fakeDateService.UtcNow.AddHours(-1);
    DateTime endDate = _fakeDateService.UtcNow.AddHours(+1);

    var command = new UpsertTimerEntryCommand
    {
      JournalId = JournalId,
      StartDate = startDate,
      EndDate = endDate
    };

    CommandResult result =
      await new UpsertTimerEntryCommandExecutor(_testRepository, _fakeDateService).Execute(command);

    result.EntityId.Should().NotBeNull();
    _testRepository.Entries.Count.Should().Be(1);

    var entry = await _testRepository.GetEntry(result.EntityId) as TimerEntry;

    entry.Should().NotBeNull();
    entry!.StartDate.Should().Be(startDate);
    entry.EndDate.Should().Be(endDate);
  }

  [Test]
  public async Task StartNewEntry_WhenBlankCommand()
  {
    var command = new UpsertTimerEntryCommand { JournalId = JournalId };

    CommandResult result =
      await new UpsertTimerEntryCommandExecutor(_testRepository, _fakeDateService).Execute(command);

    result.EntityId.Should().NotBeNull();
    _testRepository.Entries.Count.Should().Be(1);

    var entry = await _testRepository.GetEntry(result.EntityId) as TimerEntry;

    entry.Should().NotBeNull();
    entry?.StartDate.Should().Be(_fakeDateService.UtcNow);
  }

  [Test]
  public async Task EndExistingEntry_WhenBlankCommand()
  {
    _testRepository.Entries.Add(
      new TimerEntry
      {
        Id = Guid.NewGuid().ToString("N"),
        ParentId = JournalId,
        StartDate = _fakeDateService.UtcNow.AddMinutes(-10)
      }
    );

    _testRepository.Entries.Count.Should().Be(1);

    var command = new UpsertTimerEntryCommand { JournalId = JournalId };

    CommandResult result =
      await new UpsertTimerEntryCommandExecutor(_testRepository, _fakeDateService).Execute(command);

    result.EntityId.Should().NotBeNull();
    _testRepository.Entries.Count.Should().Be(1);

    var entry = await _testRepository.GetEntry(result.EntityId) as TimerEntry;

    entry.Should().NotBeNull();
    entry?.EndDate.Should().Be(_fakeDateService.UtcNow);
  }

  [Test]
  public async Task UpdateExistingEntry_WithValuesFromCommand()
  {
    var entryId = Guid.NewGuid().ToString("N");

    _testRepository.Entries.Add(
      new TimerEntry
      {
        Id = entryId,
        ParentId = JournalId,
        StartDate = _fakeDateService.UtcNow.AddMinutes(-50),
        EndDate = _fakeDateService.UtcNow.AddMinutes(-10)
      }
    );

    _testRepository.Entries.Count.Should().Be(1);

    DateTime newStartDate = _fakeDateService.UtcNow.AddMinutes(-30);
    DateTime? newEndDate = null;

    var command = new UpsertTimerEntryCommand
    {
      Id = entryId,
      JournalId = JournalId,
      StartDate = newStartDate,
      EndDate = newEndDate
    };

    CommandResult result =
      await new UpsertTimerEntryCommandExecutor(_testRepository, _fakeDateService).Execute(command);

    result.EntityId.Should().NotBeNull();
    _testRepository.Entries.Count.Should().Be(1);

    var entry = await _testRepository.GetEntry(result.EntityId) as TimerEntry;

    entry.Should().NotBeNull();
    entry?.StartDate.Should().Be(newStartDate);
    entry?.DateTime.Should().Be(newStartDate);
    entry?.EndDate.Should().Be(newEndDate);
  }
  
  [Test]
  public async Task UpdateExistingEntry_ChangeExistingStartDateWhenNoEndDate()
  {
    var entryId = Guid.NewGuid().ToString("N");

    _testRepository.Entries.Add(
      new TimerEntry
      {
        Id = entryId,
        ParentId = JournalId,
        StartDate = _fakeDateService.UtcNow.AddMinutes(-50),
        EndDate = null
      }
    );

    _testRepository.Entries.Count.Should().Be(1);

    DateTime newStartDate = _fakeDateService.UtcNow.AddMinutes(-30);

    var command = new UpsertTimerEntryCommand
    {
      Id = entryId,
      JournalId = JournalId,
      StartDate = newStartDate,
      EndDate = null
    };

    CommandResult result =
      await new UpsertTimerEntryCommandExecutor(_testRepository, _fakeDateService).Execute(command);

    result.EntityId.Should().NotBeNull();
    _testRepository.Entries.Count.Should().Be(1);

    var entry = await _testRepository.GetEntry(result.EntityId) as TimerEntry;

    entry.Should().NotBeNull();
    entry?.StartDate.Should().Be(newStartDate);
    entry?.DateTime.Should().Be(newStartDate);
    entry?.EndDate.Should().Be(null);
  }

}
