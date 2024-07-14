﻿using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Entries.Move;

public class MoveEntryCommandExecutorShould
{
  private FakeDateService _dateService = null!;
  private InMemoryRepository _repo = null!;

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
    _repo.Entries.Add(
      new CounterEntry
      {
        Id = "entry-id",
        ParentId = "source-journal-id",
        DateTime = _dateService.UtcNow
      }
    );
    IEntry[] sourceEntries = await _repo.GetEntriesForJournal("source-journal-id");
    sourceEntries.Length.Should().Be(1);

    // given: target
    _repo.Journals.Add(new CounterJournal { Id = "target-journal-id" });
    IEntry[] targetEntries = await _repo.GetEntriesForJournal("target-journal-id");
    targetEntries.Should().BeEmpty();

    // when
    await new MoveEntryCommandExecutor(
      _repo,
      _dateService
    ).Execute(
      new MoveEntryCommand
      {
        EntryId = "entry-id",
        TargetJournalId = "target-journal-id"
      }
    );

    // then
    targetEntries = await _repo.GetEntriesForJournal("target-journal-id");
    targetEntries.Length.Should().Be(1);

    sourceEntries = await _repo.GetEntriesForJournal("source-journal-id");
    sourceEntries.Should().BeEmpty();
  }
}
