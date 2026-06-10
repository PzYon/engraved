using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Entries.Delete;

public class DeleteEntryCommandExecutorShould
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
  public async Task DeleteEntry_And_BumpJournalEditedOn()
  {
    // given
    _repo.Journals.Add(
      new CounterJournal
      {
        Id = "journal-id",
        Permissions = new UserPermissions { { "user-id", new PermissionDefinition { Kind = PermissionKind.Read } } }
      }
    );
    _repo.Entries.Add(
      new CounterEntry
      {
        Id = "entry-id",
        ParentId = "journal-id",
        DateTime = _dateService.UtcNow
      }
    );

    // when
    CommandResult result = await new DeleteEntryCommandExecutor(_repo, _dateService).Execute(
      new DeleteEntryCommand { Id = "entry-id" }
    );

    // then
    (await _repo.GetEntry("entry-id")).Should().BeNull();

    IJournal journal = (await _repo.GetJournal("journal-id"))!;
    journal.EditedOn.Should().Be(_dateService.UtcNow);

    result.EntityId.Should().Be("entry-id");
    result.AffectedUserIds.Should().Contain("user-id");
  }

  [Test]
  public async Task ReturnEmptyResult_When_EntryDoesNotExist()
  {
    // when
    CommandResult result = await new DeleteEntryCommandExecutor(_repo, _dateService).Execute(
      new DeleteEntryCommand { Id = "does-not-exist" }
    );

    // then
    result.EntityId.Should().BeNull();
    result.AffectedUserIds.Should().BeEmpty();
  }
}
