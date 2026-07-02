using System;
using System.Threading.Tasks;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.TestUtils;
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
    const string sourceJournalId = "60703c3b0000000000000001";
    const string targetJournalId = "60703c3b0000000000000002";
    const string entryId = "60703c3b0000000000000003";

    // given: source
    await _repo.UpsertJournal(new CounterJournal { Id = sourceJournalId });
    await _repo.UpsertEntry(
      new CounterEntry
      {
        Id = entryId,
        ParentId = sourceJournalId,
        DateTime = _dateService.UtcNow
      }
    );
    IEntry[] sourceEntries = await _repo.GetEntriesForJournal(sourceJournalId);
    sourceEntries.Length.Should().Be(1);

    // given: target
    await _repo.UpsertJournal(new CounterJournal { Id = targetJournalId });
    IEntry[] targetEntries = await _repo.GetEntriesForJournal(targetJournalId);
    targetEntries.Should().BeEmpty();

    // when
    await new MoveEntryCommandExecutor(
      _repo,
      _repo,
      _dateService
    ).Execute(
      new MoveEntryCommand
      {
        EntryId = entryId,
        TargetJournalId = targetJournalId
      }
    );

    // then
    targetEntries = await _repo.GetEntriesForJournal(targetJournalId);
    targetEntries.Length.Should().Be(1);

    sourceEntries = await _repo.GetEntriesForJournal(sourceJournalId);
    sourceEntries.Should().BeEmpty();
  }
}
