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

  private const string SourceJournalId = "60703c3b0000000000000001";
  private const string TargetJournalId = "60703c3b0000000000000002";
  private const string EntryId = "60703c3b0000000000000003";

  [Test]
  public async Task MoveEntryToOtherJournal()
  {
    // given: source
    await _repo.UpsertJournal(new CounterJournal { Id = SourceJournalId });
    await _repo.UpsertEntry(
      new CounterEntry
      {
        Id = EntryId,
        ParentId = SourceJournalId,
        DateTime = _dateService.UtcNow
      }
    );
    IEntry[] sourceEntries = await _repo.GetEntriesForJournal(SourceJournalId);
    sourceEntries.Length.Should().Be(1);

    // given: target
    await _repo.UpsertJournal(new CounterJournal { Id = TargetJournalId });
    IEntry[] targetEntries = await _repo.GetEntriesForJournal(TargetJournalId);
    targetEntries.Should().BeEmpty();

    // when
    await new MoveEntryCommandExecutor(
      _repo,
      _dateService
    ).Execute(
      new MoveEntryCommand
      {
        EntryId = EntryId,
        TargetJournalId = TargetJournalId
      }
    );

    // then
    targetEntries = await _repo.GetEntriesForJournal(TargetJournalId);
    targetEntries.Length.Should().Be(1);

    sourceEntries = await _repo.GetEntriesForJournal(SourceJournalId);
    sourceEntries.Should().BeEmpty();
  }
}
