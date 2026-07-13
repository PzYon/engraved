using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Engraved.Core.Application.Permissions;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Journals.EditPermissions;

public class EditJournalPermissionsCommandExecutorShould
{
  private const string CurrentUserName = "me@foo.ch";
  private const string CurrentUserId = "60703c3b00000000000000f1";
  private const string OtherUserName = "other@foo.ch";
  private const string JournalId = "60703c3b00000000000000f3";

  private TestMongoRepository _repo = null!;
  private TestUserRestrictedMongoRepository _userScopedRepo = null!;
  private PermissionsEnsurer _permissionsEnsurer = null!;
  private string _otherUserId = null!;

  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateMongoRepository();

    await _repo.UpsertUser(new User { Id = CurrentUserId, Name = CurrentUserName });
    _otherUserId = (await _repo.UpsertUser(new User { Name = OtherUserName })).EntityId;

    _userScopedRepo = await Util.CreateUserRestrictedMongoRepository(CurrentUserName, CurrentUserId, true);

    // the ensurer works on the plain (unguarded) repository, mirroring the DI registration in
    // PersistenceRegistration: it may create records for users receiving a permission
    _permissionsEnsurer = new PermissionsEnsurer(_repo, _repo.UpsertUser);
  }

  [Test]
  public async Task Throw_When_JournalIdIsEmpty()
  {
    Func<Task> act = () => CreateExecutor().Execute(
      new EditJournalPermissionsCommand { JournalId = "" }
    );

    await act.Should().ThrowAsync<InvalidCommandException>();
  }

  [Test]
  public async Task AddPermission_And_ReturnUnionOfBeforeAndAfterUsers()
  {
    // given: a journal the current user may write, and a second user to grant access to
    await _repo.UpsertJournal(
      new CounterJournal
      {
        Id = JournalId,
        Permissions = new UserPermissions
        {
          { CurrentUserId, new PermissionDefinition { Kind = PermissionKind.Write } }
        }
      }
    );

    // when
    CommandResult result = await CreateExecutor().Execute(
      new EditJournalPermissionsCommand
      {
        JournalId = JournalId,
        Permissions = new Dictionary<string, PermissionKind> { { OtherUserName, PermissionKind.Read } }
      }
    );

    // then
    IJournal journal = (await _repo.GetJournal(JournalId))!;
    journal.Permissions.Should().ContainKey(CurrentUserId);
    journal.Permissions.Should().ContainKey(_otherUserId);

    result.EntityId.Should().Be(JournalId);
    result.AffectedUserIds.Should().BeEquivalentTo(CurrentUserId, _otherUserId);
  }

  [Test]
  public async Task LeavePermissionsUnchanged_When_NoPermissionsProvided()
  {
    // given
    await _repo.UpsertJournal(
      new CounterJournal
      {
        Id = JournalId,
        Permissions = new UserPermissions
        {
          { CurrentUserId, new PermissionDefinition { Kind = PermissionKind.Write } }
        }
      }
    );

    // when
    CommandResult result = await CreateExecutor().Execute(
      new EditJournalPermissionsCommand { JournalId = JournalId }
    );

    // then
    IJournal journal = (await _repo.GetJournal(JournalId))!;
    journal.Permissions.Should().ContainKey(CurrentUserId);
    result.AffectedUserIds.Should().BeEquivalentTo(CurrentUserId);
  }

  [Test]
  public async Task Throw_WithNoPermissionsAtAll()
  {
    // Modifying permissions is a write: without it, a user could grant themselves (or others)
    // access to a journal they can merely see - or not even that. Pinned because this guard was
    // once lost in a refactoring without any test noticing.
    await CreateJournalOwnedByOtherUser();

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await ModifyPermissionsAsCurrentUser(); }
    );

    await AssertNoUserRecordWasCreatedForNewcomer();
  }

  [Test]
  public async Task Throw_WithOnlyReadPermissions()
  {
    await CreateJournalOwnedByOtherUser();
    await GrantCurrentUserPermission(PermissionKind.Read);

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await ModifyPermissionsAsCurrentUser(); }
    );

    await AssertNoUserRecordWasCreatedForNewcomer();
  }

  [Test]
  public async Task ModifyPermissions_WithWritePermissions()
  {
    await CreateJournalOwnedByOtherUser();
    await GrantCurrentUserPermission(PermissionKind.Write);

    await ModifyPermissionsAsCurrentUser();

    IJournal journal = (await _repo.GetJournal(JournalId))!;
    var newcomerId = (await _repo.GetUser("newcomer@foo.ch"))!.Id;
    journal.Permissions.Should().ContainKey(newcomerId!);
  }

  private EditJournalPermissionsCommandExecutor CreateExecutor()
  {
    return new EditJournalPermissionsCommandExecutor(_userScopedRepo, _permissionsEnsurer);
  }

  private async Task CreateJournalOwnedByOtherUser()
  {
    await _repo.UpsertJournal(
      new CounterJournal
      {
        Id = JournalId,
        UserId = _otherUserId
      }
    );
  }

  private async Task ModifyPermissionsAsCurrentUser()
  {
    await CreateExecutor().Execute(
      new EditJournalPermissionsCommand
      {
        JournalId = JournalId,
        Permissions = new Dictionary<string, PermissionKind> { { "newcomer@foo.ch", PermissionKind.Read } }
      }
    );
  }

  private async Task GrantCurrentUserPermission(PermissionKind kind)
  {
    IJournal journal = (await _repo.GetJournal(JournalId))!;
    await _permissionsEnsurer.EnsurePermissions(
      journal,
      new Dictionary<string, PermissionKind> { { CurrentUserName, kind } }
    );
    await _repo.UpsertJournal(journal);
  }

  // pins that write access is checked BEFORE PermissionsEnsurer runs: a rejected caller must not
  // cause user records to be created as a side effect
  private async Task AssertNoUserRecordWasCreatedForNewcomer()
  {
    (await _repo.GetUser("newcomer@foo.ch")).Should().BeNull();
  }
}
