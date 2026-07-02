using System;
using System.Threading.Tasks;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
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

  [Test]
  public async Task ReturnAffectedUserIds_Of_SourceAndTargetJournal()
  {
    const string sourceJournalId = "60703c3b0000000000000001";
    const string targetJournalId = "60703c3b0000000000000002";
    const string entryId = "60703c3b0000000000000003";

    // given: a user with permissions on the source journal and another one on the target journal
    await _repo.UpsertJournal(
      new CounterJournal
      {
        Id = sourceJournalId,
        Permissions = new UserPermissions
        {
          { TestIds.UserId, new PermissionDefinition { Kind = PermissionKind.Read } }
        }
      }
    );

    await _repo.UpsertJournal(
      new CounterJournal
      {
        Id = targetJournalId,
        Permissions = new UserPermissions
        {
          { TestIds.OtherUserId, new PermissionDefinition { Kind = PermissionKind.Read } }
        }
      }
    );

    await _repo.UpsertEntry(
      new CounterEntry
      {
        Id = entryId,
        ParentId = sourceJournalId,
        DateTime = _dateService.UtcNow
      }
    );

    // when
    CommandResult result = await new MoveEntryCommandExecutor(
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

    // then: users of BOTH journals are affected (e.g. for cache invalidation),
    // especially the ones only having access to the source journal.
    result.AffectedUserIds.Should().Contain(TestIds.UserId);
    result.AffectedUserIds.Should().Contain(TestIds.OtherUserId);
  }
}
