using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Users.Delete;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Users;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application.Commands.Users.Delete;

public class DeleteUserCommandExecutorShould
{
  private const string AdminId = "60703c3b0000000000000001";
  private const string TargetUserId = "60703c3b0000000000000002";
  private const string JournalId = "60703c3b0000000000000003";
  private const string OtherJournalId = "60703c3b0000000000000004";

  private TestMongoRepository _repo = null!;
  private Lazy<IUser> _admin = null!;

  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateMongoRepository();
    _admin = new Lazy<IUser>(() => new User { Id = AdminId, Name = "admin@x.com" });
  }

  [Test]
  public async Task DeleteUser_And_ItsJournalsAndEntries()
  {
    // given
    await _repo.UpsertUser(new User { Id = TargetUserId, Name = "target@x.com" });
    await _repo.UpsertJournal(new CounterJournal { Id = JournalId, UserId = TargetUserId });
    await _repo.UpsertJournal(new CounterJournal { Id = OtherJournalId, UserId = TargetUserId });
    await _repo.UpsertEntry(new CounterEntry { ParentId = JournalId });
    await _repo.UpsertEntry(new CounterEntry { ParentId = OtherJournalId });

    // when
    CommandResult result = await new DeleteUserCommandExecutor(_repo, _admin).Execute(
      new DeleteUserCommand { UserId = TargetUserId }
    );

    // then
    (await _repo.GetUser(TargetUserId)).Should().BeNull();
    (await _repo.GetJournal(JournalId)).Should().BeNull();
    (await _repo.GetJournal(OtherJournalId)).Should().BeNull();
    (await _repo.SearchEntries(null, journalIds: [JournalId, OtherJournalId])).Should().BeEmpty();

    result.EntityId.Should().Be(TargetUserId);
    result.AffectedUserIds.Should().Contain(TargetUserId);
  }

  [Test]
  public async Task NotDelete_JournalsOfOtherUsers()
  {
    // given
    await _repo.UpsertUser(new User { Id = TargetUserId, Name = "target@x.com" });
    await _repo.UpsertJournal(new CounterJournal { Id = JournalId, UserId = TargetUserId });
    await _repo.UpsertJournal(new CounterJournal { Id = OtherJournalId, UserId = AdminId });

    // when
    await new DeleteUserCommandExecutor(_repo, _admin).Execute(
      new DeleteUserCommand { UserId = TargetUserId }
    );

    // then
    (await _repo.GetJournal(JournalId)).Should().BeNull();
    (await _repo.GetJournal(OtherJournalId)).Should().NotBeNull();
  }

  [Test]
  public void PreventDeletingYourOwnAccount()
  {
    Assert.ThrowsAsync<NotAllowedOperationException>(async () =>
      await new DeleteUserCommandExecutor(_repo, _admin).Execute(
        new DeleteUserCommand { UserId = AdminId }
      )
    );
  }

  [Test]
  public async Task ReturnEmptyResult_When_UserDoesNotExist()
  {
    // when
    CommandResult result = await new DeleteUserCommandExecutor(_repo, _admin).Execute(
      new DeleteUserCommand { UserId = "60703c3b0000000000000999" }
    );

    // then
    result.EntityId.Should().BeNull();
    result.AffectedUserIds.Should().BeEmpty();
  }
}
