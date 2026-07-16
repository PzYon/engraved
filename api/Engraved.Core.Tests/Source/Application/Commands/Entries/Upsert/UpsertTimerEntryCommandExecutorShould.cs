using System;
using System.Threading.Tasks;
using Engraved.Core.Application;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Entries.Upsert.Timer;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application.Commands.Entries.Upsert;

public class UpsertTimerEntryCommandExecutorShould
{
  private const string JournalId = "626dab25f1a93c5c724d820a";
  private FakeDateService _fakeDateService = null!;
  private TestMongoRepository _testRepository = null!;

  [SetUp]
  public async Task SetUp()
  {
    _fakeDateService = new FakeDateService();
    _testRepository = await Util.CreateMongoRepository();

    await _testRepository.UpsertJournal(new TimerJournal { Id = JournalId });
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
      await new UpsertTimerEntryCommandExecutor(_testRepository, _testRepository, _fakeDateService).Execute(command);

    result.EntityId.Should().NotBeNull();
    (await _testRepository.CountAllEntries()).Should().Be(1);

    var entry = await _testRepository.GetEntry(result.EntityId) as TimerEntry;

    entry.Should().NotBeNull();
    entry.StartDate.Should().BeCloseTo(startDate, TimeSpan.FromMilliseconds(100));
    entry.EndDate.Should().BeCloseTo(endDate, TimeSpan.FromMilliseconds(100));
  }

  [Test]
  public async Task StartNewEntry_WhenBlankCommand()
  {
    var command = new UpsertTimerEntryCommand { JournalId = JournalId };

    CommandResult result =
      await new UpsertTimerEntryCommandExecutor(_testRepository, _testRepository, _fakeDateService).Execute(command);

    result.EntityId.Should().NotBeNull();
    (await _testRepository.CountAllEntries()).Should().Be(1);

    var entry = await _testRepository.GetEntry(result.EntityId) as TimerEntry;

    entry.Should().NotBeNull();
    entry.StartDate.Should().BeCloseTo(_fakeDateService.UtcNow, TimeSpan.FromMilliseconds(100));
  }

  [Test]
  public async Task EndExistingEntry_WhenBlankCommand()
  {
    var entryId = "60703c3b00000000000000e1";
    await _testRepository.UpsertEntry(
      new TimerEntry
      {
        Id = entryId,
        ParentId = JournalId,
        StartDate = _fakeDateService.UtcNow.AddMinutes(-10)
      }
    );

    (await _testRepository.CountAllEntries()).Should().Be(1);

    var command = new UpsertTimerEntryCommand { JournalId = JournalId };

    CommandResult result =
      await new UpsertTimerEntryCommandExecutor(_testRepository, _testRepository, _fakeDateService).Execute(command);

    result.EntityId.Should().NotBeNull();
    (await _testRepository.CountAllEntries()).Should().Be(1);

    var entry = await _testRepository.GetEntry(result.EntityId) as TimerEntry;

    entry.Should().NotBeNull();
    entry.EndDate.Should().BeCloseTo(_fakeDateService.UtcNow, TimeSpan.FromMilliseconds(100));
  }

  [Test]
  public async Task UpdateExistingEntry_WithValuesFromCommand()
  {
    var entryId = "60703c3b00000000000000e2";

    await _testRepository.UpsertEntry(
      new TimerEntry
      {
        Id = entryId,
        ParentId = JournalId,
        StartDate = _fakeDateService.UtcNow.AddMinutes(-50),
        EndDate = _fakeDateService.UtcNow.AddMinutes(-10)
      }
    );

    (await _testRepository.CountAllEntries()).Should().Be(1);

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
      await new UpsertTimerEntryCommandExecutor(_testRepository, _testRepository, _fakeDateService).Execute(command);

    result.EntityId.Should().NotBeNull();
    (await _testRepository.CountAllEntries()).Should().Be(1);

    var entry = await _testRepository.GetEntry(result.EntityId) as TimerEntry;

    entry.Should().NotBeNull();
    entry.StartDate.Should().BeCloseTo(newStartDate, TimeSpan.FromMilliseconds(100));
    entry.DateTime.Should().BeCloseTo(newStartDate, TimeSpan.FromMilliseconds(100));
    entry.EndDate.Should().Be(newEndDate);
  }

  [Test]
  public async Task Create_WithClientGeneratedIdAndExplicitDates_DoesNotReDecideAgainstActiveEntry()
  {
    // an entry is already running ...
    var activeEntryId = "60703c3b00000000000000e4";
    await _testRepository.UpsertEntry(
      new TimerEntry
      {
        Id = activeEntryId,
        ParentId = JournalId,
        StartDate = _fakeDateService.UtcNow.AddMinutes(-60)
      }
    );

    // ... and a start decided by the client (e.g. while offline) arrives with a client-generated
    // id and an explicit start date
    DateTime clientStartDate = _fakeDateService.UtcNow.AddMinutes(-5);

    var command = new UpsertTimerEntryCommand
    {
      Id = "66703c3b00000000000000e5",
      IsNew = true,
      JournalId = JournalId,
      StartDate = clientStartDate
    };

    CommandResult result =
      await new UpsertTimerEntryCommandExecutor(_testRepository, _testRepository, _fakeDateService).Execute(command);

    // the command is applied as sent: the client's start date is kept (not replaced by "now" at
    // replay time), and the already-active entry is left alone instead of being auto-stopped -
    // "at most one open timer" is reconciled eventually, not re-decided here
    result.EntityId.Should().Be(command.Id);
    (await _testRepository.CountAllEntries()).Should().Be(2);

    var createdEntry = await _testRepository.GetEntry(command.Id) as TimerEntry;
    createdEntry!.StartDate.Should().BeCloseTo(clientStartDate, TimeSpan.FromMilliseconds(100));
    createdEntry.EndDate.Should().BeNull();

    var activeEntry = await _testRepository.GetEntry(activeEntryId) as TimerEntry;
    activeEntry!.EndDate.Should().BeNull();
  }

  [Test]
  public async Task UpdateExistingEntry_ChangeExistingStartDateWhenNoEndDate()
  {
    var entryId = "60703c3b00000000000000e3";

    await _testRepository.UpsertEntry(
      new TimerEntry
      {
        Id = entryId,
        ParentId = JournalId,
        StartDate = _fakeDateService.UtcNow.AddMinutes(-50),
        EndDate = null
      }
    );

    (await _testRepository.CountAllEntries()).Should().Be(1);

    DateTime newStartDate = _fakeDateService.UtcNow.AddMinutes(-30);

    var command = new UpsertTimerEntryCommand
    {
      Id = entryId,
      JournalId = JournalId,
      StartDate = newStartDate,
      EndDate = null
    };

    CommandResult result =
      await new UpsertTimerEntryCommandExecutor(_testRepository, _testRepository, _fakeDateService).Execute(command);

    result.EntityId.Should().NotBeNull();
    (await _testRepository.CountAllEntries()).Should().Be(1);

    var entry = await _testRepository.GetEntry(result.EntityId) as TimerEntry;

    entry.Should().NotBeNull();
    entry?.StartDate.Should().BeCloseTo(newStartDate, TimeSpan.FromMilliseconds(100));
    entry?.DateTime.Should().BeCloseTo(newStartDate, TimeSpan.FromMilliseconds(100));
    entry?.EndDate.Should().Be(null);
  }
}
