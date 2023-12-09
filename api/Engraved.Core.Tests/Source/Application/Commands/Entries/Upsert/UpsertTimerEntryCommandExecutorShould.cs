﻿using System;
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

    Assert.AreEqual(1, _testRepository.Entries.Count);
    var entry = await _testRepository.GetEntry(result.EntityId) as TimerEntry;

    entry.Should().NotBeNull();
    Assert.AreEqual(_fakeDateService.UtcNow, entry?.StartDate);
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

    Assert.AreEqual(1, _testRepository.Entries.Count);

    var command = new UpsertTimerEntryCommand { JournalId = JournalId };

    CommandResult result =
      await new UpsertTimerEntryCommandExecutor(_testRepository, _fakeDateService).Execute(command);

    Assert.IsNotNull(result.EntityId);
    Assert.AreEqual(1, _testRepository.Entries.Count);
    var entry = await _testRepository.GetEntry(result.EntityId) as TimerEntry;

    Assert.IsNotNull(entry);
    Assert.AreEqual(_fakeDateService.UtcNow, entry?.EndDate);
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

    Assert.AreEqual(1, _testRepository.Entries.Count);

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

    Assert.IsNotNull(result.EntityId);
    Assert.AreEqual(1, _testRepository.Entries.Count);
    var entry = await _testRepository.GetEntry(result.EntityId) as TimerEntry;

    Assert.IsNotNull(entry);
    Assert.AreEqual(newStartDate, entry?.StartDate);
    Assert.AreEqual(newStartDate, entry?.DateTime);
    Assert.AreEqual(newEndDate, entry?.EndDate);
  }
}
