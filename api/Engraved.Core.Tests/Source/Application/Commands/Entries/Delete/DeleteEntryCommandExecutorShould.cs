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

  [Test]
  public async Task DeleteEntry_And_BumpJournalEditedOn()
  {
    // given
    await _repo.UpsertJournal(
      new CounterJournal
      {
        Id = "60703c3b0000000000000001",
        Permissions = new UserPermissions { { "60703c3b0000000000000002", new PermissionDefinition { Kind = PermissionKind.Read } } }
      }
    );
    await _repo.UpsertEntry(
      new CounterEntry
      {
        Id = "60703c3b0000000000000003",
        ParentId = "60703c3b0000000000000001",
        DateTime = _dateService.UtcNow
      }
    );

    // when
    CommandResult result = await new DeleteEntryCommandExecutor(_repo, _dateService).Execute(
      new DeleteEntryCommand { Id = "60703c3b0000000000000003" }
    );

    // then
    (await _repo.GetEntry("60703c3b0000000000000003")).Should().BeNull();

    IJournal journal = (await _repo.GetJournal("60703c3b0000000000000001"))!;
    journal.EditedOn.Should().BeCloseTo(_dateService.UtcNow, TimeSpan.FromMilliseconds(100));

    result.EntityId.Should().Be("60703c3b0000000000000003");
    result.AffectedUserIds.Should().Contain("60703c3b0000000000000002");
  }

  [Test]
  public async Task ReturnEmptyResult_When_EntryDoesNotExist()
  {
    // when
    CommandResult result = await new DeleteEntryCommandExecutor(_repo, _dateService).Execute(
      new DeleteEntryCommand { Id = "60703c3b0000000000000004" }
    );

    // then
    result.EntityId.Should().BeNull();
    result.AffectedUserIds.Should().BeEmpty();
  }
}
