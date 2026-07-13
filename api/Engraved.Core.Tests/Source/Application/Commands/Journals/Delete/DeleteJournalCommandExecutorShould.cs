using System.Threading.Tasks;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Journals.Delete;

public class DeleteJournalCommandExecutorShould
{
  private const string JournalId = "60703c3b0000000000000001";
  private const string UserId = "60703c3b0000000000000002";

  private TestMongoRepository _repo = null!;

  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateMongoRepository();
  }

  [Test]
  public async Task DeleteJournal_And_ReturnAffectedUsers()
  {
    // given
    await _repo.UpsertJournal(
      new CounterJournal
      {
        Id = JournalId,
        Permissions = new UserPermissions { { UserId, new PermissionDefinition { Kind = PermissionKind.Write } } }
      }
    );

    // when
    CommandResult result = await new DeleteJournalCommandExecutor(_repo, _repo).Execute(
      new DeleteJournalCommand { JournalId = JournalId }
    );

    // then
    (await _repo.GetJournal(JournalId)).Should().BeNull();

    result.EntityId.Should().Be(JournalId);
    result.AffectedUserIds.Should().Contain(UserId);
  }

  [Test]
  public async Task DeleteJournal_And_ItsEntries()
  {
    // the "a journal's entries die with it" cascade is owned by this executor (the repository
    // deletes only the journal document itself)
    await _repo.UpsertJournal(new CounterJournal { Id = JournalId });
    await _repo.UpsertEntry(new CounterEntry { ParentId = JournalId });
    await _repo.UpsertEntry(new CounterEntry { ParentId = JournalId });

    await new DeleteJournalCommandExecutor(_repo, _repo).Execute(
      new DeleteJournalCommand { JournalId = JournalId }
    );

    (await _repo.GetJournal(JournalId)).Should().BeNull();
    (await _repo.SearchEntries(null, journalIds: [JournalId])).Should().BeEmpty();
  }

  [Test]
  public async Task ReturnEmptyResult_When_JournalDoesNotExist()
  {
    // when
    CommandResult result = await new DeleteJournalCommandExecutor(_repo, _repo).Execute(
      new DeleteJournalCommand { JournalId = "60703c3b0000000000000999" }
    );

    // then
    result.EntityId.Should().BeNull();
    result.AffectedUserIds.Should().BeEmpty();
  }
}
