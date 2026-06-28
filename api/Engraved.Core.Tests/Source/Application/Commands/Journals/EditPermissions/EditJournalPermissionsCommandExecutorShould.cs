using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;
using Engraved.Persistence.Mongo.Tests;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Journals.EditPermissions;

public class EditJournalPermissionsCommandExecutorShould
{
  private TestMongoRepository _repo = null!;

  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateMongoRepository();
  }

  [Test]
  public async Task Throw_When_JournalIdIsEmpty()
  {
    Func<Task> act = () => new EditJournalPermissionsCommandExecutor(_repo).Execute(
      new EditJournalPermissionsCommand { JournalId = "" }
    );

    await act.Should().ThrowAsync<InvalidCommandException>();
  }

  [Test]
  public async Task AddPermission_And_ReturnUnionOfBeforeAndAfterUsers()
  {
    // given: a journal owned by an existing user and a second user to grant access to
    const string ownerId = "60703c3b00000000000000f1";
    const string newId = "60703c3b00000000000000f2";
    const string journalId = "60703c3b00000000000000f3";

    await _repo.UpsertUser(new User { Id = ownerId, Name = "owner@foo.ch" });
    await _repo.UpsertUser(new User { Id = newId, Name = "new@foo.ch" });

    await _repo.UpsertJournal(
      new CounterJournal
      {
        Id = journalId,
        Permissions = new UserPermissions { { ownerId, new PermissionDefinition { Kind = PermissionKind.Write } } }
      }
    );

    // when
    CommandResult result = await new EditJournalPermissionsCommandExecutor(_repo).Execute(
      new EditJournalPermissionsCommand
      {
        JournalId = journalId,
        Permissions = new Dictionary<string, PermissionKind> { { "new@foo.ch", PermissionKind.Read } }
      }
    );

    // then
    IJournal journal = (await _repo.GetJournal(journalId))!;
    journal.Permissions.Should().ContainKey(ownerId);
    journal.Permissions.Should().ContainKey(newId);

    result.EntityId.Should().Be(journalId);
    result.AffectedUserIds.Should().BeEquivalentTo(ownerId, newId);
  }

  [Test]
  public async Task LeavePermissionsUnchanged_When_NoPermissionsProvided()
  {
    // given
    const string ownerId = "60703c3b00000000000000f1";
    const string journalId = "60703c3b00000000000000f3";

    await _repo.UpsertJournal(
      new CounterJournal
      {
        Id = journalId,
        Permissions = new UserPermissions { { ownerId, new PermissionDefinition { Kind = PermissionKind.Write } } }
      }
    );

    // when
    CommandResult result = await new EditJournalPermissionsCommandExecutor(_repo).Execute(
      new EditJournalPermissionsCommand { JournalId = journalId }
    );

    // then
    IJournal journal = (await _repo.GetJournal(journalId))!;
    journal.Permissions.Should().ContainKey(ownerId);
    result.AffectedUserIds.Should().BeEquivalentTo(ownerId);
  }
}
