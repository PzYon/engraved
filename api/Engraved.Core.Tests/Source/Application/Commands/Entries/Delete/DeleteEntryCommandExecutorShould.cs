using System;
using System.Threading.Tasks;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Entries.Delete;

public class DeleteEntryCommandExecutorShould
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
  public async Task DeleteEntry_And_BumpJournalEditedOn()
  {
    const string journalId = "60703c3b0000000000000001";
    const string otherUserId = "60703c3b0000000000000002";
    const string entryId = "60703c3b0000000000000003";

    // given
    await _repo.UpsertJournal(
      new CounterJournal
      {
        Id = journalId,
        Permissions = new UserPermissions { { otherUserId, new PermissionDefinition { Kind = PermissionKind.Read } } }
      }
    );
    await _repo.UpsertEntry(
      new CounterEntry
      {
        Id = entryId,
        ParentId = journalId,
        DateTime = _dateService.UtcNow
      }
    );

    // when
    CommandResult result = await new DeleteEntryCommandExecutor(_repo, _repo, _dateService).Execute(
      new DeleteEntryCommand { Id = entryId }
    );

    // then
    (await _repo.GetEntry(entryId)).Should().BeNull();

    IJournal journal = (await _repo.GetJournal(journalId))!;
    journal.EditedOn.Should().BeCloseTo(_dateService.UtcNow, TimeSpan.FromMilliseconds(100));

    result.EntityId.Should().Be(entryId);
    result.AffectedUserIds.Should().Contain(otherUserId);
  }

  [Test]
  public async Task ReturnEmptyResult_When_EntryDoesNotExist()
  {
    const string missingEntryId = "60703c3b0000000000000004";

    // when
    CommandResult result = await new DeleteEntryCommandExecutor(_repo, _repo, _dateService).Execute(
      new DeleteEntryCommand { Id = missingEntryId }
    );

    // then
    result.EntityId.Should().BeNull();
    result.AffectedUserIds.Should().BeEmpty();
  }
}
