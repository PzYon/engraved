using System.Threading.Tasks;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Journals.Delete;

public class DeleteJournalCommandExecutorShould
{
  private InMemoryRepository _repo = null!;

  [SetUp]
  public void SetUp()
  {
    _repo = new InMemoryRepository();
  }

  [Test]
  public async Task DeleteJournal_And_ReturnAffectedUsers()
  {
    // given
    _repo.Journals.Add(
      new CounterJournal
      {
        Id = "journal-id",
        Permissions = new UserPermissions { { "user-id", new PermissionDefinition { Kind = PermissionKind.Write } } }
      }
    );

    // when
    CommandResult result = await new DeleteJournalCommandExecutor(_repo).Execute(
      new DeleteJournalCommand { JournalId = "journal-id" }
    );

    // then
    (await _repo.GetJournal("journal-id")).Should().BeNull();

    result.EntityId.Should().Be("journal-id");
    result.AffectedUserIds.Should().Contain("user-id");
  }

  [Test]
  public async Task ReturnEmptyResult_When_JournalDoesNotExist()
  {
    // when
    CommandResult result = await new DeleteJournalCommandExecutor(_repo).Execute(
      new DeleteJournalCommand { JournalId = "does-not-exist" }
    );

    // then
    result.EntityId.Should().BeNull();
    result.AffectedUserIds.Should().BeEmpty();
  }
}
