using System;
using System.Threading.Tasks;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Persistence.Mongo.Tests;
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

  private const string JournalId = "60703c3b0000000000000001";
  private const string OtherUserId = "60703c3b0000000000000002";
  private const string EntryId = "60703c3b0000000000000003";
  private const string MissingEntryId = "60703c3b0000000000000004";

  [Test]
  public async Task DeleteEntry_And_BumpJournalEditedOn()
  {
    // given
    await _repo.UpsertJournal(
      new CounterJournal
      {
        Id = JournalId,
        Permissions = new UserPermissions { { OtherUserId, new PermissionDefinition { Kind = PermissionKind.Read } } }
      }
    );
    await _repo.UpsertEntry(
      new CounterEntry
      {
        Id = EntryId,
        ParentId = JournalId,
        DateTime = _dateService.UtcNow
      }
    );

    // when
    CommandResult result = await new DeleteEntryCommandExecutor(_repo, _dateService).Execute(
      new DeleteEntryCommand { Id = EntryId }
    );

    // then
    (await _repo.GetEntry(EntryId)).Should().BeNull();

    IJournal journal = (await _repo.GetJournal(JournalId))!;
    journal.EditedOn.Should().BeCloseTo(_dateService.UtcNow, TimeSpan.FromMilliseconds(100));

    result.EntityId.Should().Be(EntryId);
    result.AffectedUserIds.Should().Contain(OtherUserId);
  }

  [Test]
  public async Task ReturnEmptyResult_When_EntryDoesNotExist()
  {
    // when
    CommandResult result = await new DeleteEntryCommandExecutor(_repo, _dateService).Execute(
      new DeleteEntryCommand { Id = MissingEntryId }
    );

    // then
    result.EntityId.Should().BeNull();
    result.AffectedUserIds.Should().BeEmpty();
  }
}
