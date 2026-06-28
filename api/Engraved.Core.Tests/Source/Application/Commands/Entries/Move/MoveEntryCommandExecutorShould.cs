using System;
using System.Threading.Tasks;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Persistence.Mongo.Tests;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Entries.Move;

public class MoveEntryCommandExecutorShould
{
  private FakeDateService _dateService = null!;
  private TestMongoRepository _repo = null!;

  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateMongoRepository();
    _dateService = new FakeDateService(DateTime.UtcNow.AddDays(-10));
  }

  [Test]
  public async Task MoveEntryToOtherJournal()
  {
    // given: source
    await _repo.UpsertJournal(new CounterJournal { Id = "60703c3b0000000000000001" });
    await _repo.UpsertEntry(
      new CounterEntry
      {
        Id = "60703c3b0000000000000003",
        ParentId = "60703c3b0000000000000001",
        DateTime = _dateService.UtcNow
      }
    );
    IEntry[] sourceEntries = await _repo.GetEntriesForJournal("60703c3b0000000000000001");
    sourceEntries.Length.Should().Be(1);

    // given: target
    await _repo.UpsertJournal(new CounterJournal { Id = "60703c3b0000000000000002" });
    IEntry[] targetEntries = await _repo.GetEntriesForJournal("60703c3b0000000000000002");
    targetEntries.Should().BeEmpty();

    // when
    await new MoveEntryCommandExecutor(
      _repo,
      _dateService
    ).Execute(
      new MoveEntryCommand
      {
        EntryId = "60703c3b0000000000000003",
        TargetJournalId = "60703c3b0000000000000002"
      }
    );

    // then
    targetEntries = await _repo.GetEntriesForJournal("60703c3b0000000000000002");
    targetEntries.Length.Should().Be(1);

    sourceEntries = await _repo.GetEntriesForJournal("60703c3b0000000000000001");
    sourceEntries.Should().BeEmpty();
  }
}
