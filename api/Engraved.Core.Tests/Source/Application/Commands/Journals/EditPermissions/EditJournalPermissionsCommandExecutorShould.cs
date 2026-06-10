using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Journals.EditPermissions;

public class EditJournalPermissionsCommandExecutorShould
{
  private InMemoryRepository _repo = null!;

  [SetUp]
  public void SetUp()
  {
    _repo = new InMemoryRepository();
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
    _repo.Users.Add(new User { Id = "owner-id", Name = "owner@foo.ch" });
    _repo.Users.Add(new User { Id = "new-id", Name = "new@foo.ch" });

    _repo.Journals.Add(
      new CounterJournal
      {
        Id = "journal-id",
        Permissions = new UserPermissions { { "owner-id", new PermissionDefinition { Kind = PermissionKind.Write } } }
      }
    );

    // when
    CommandResult result = await new EditJournalPermissionsCommandExecutor(_repo).Execute(
      new EditJournalPermissionsCommand
      {
        JournalId = "journal-id",
        Permissions = new Dictionary<string, PermissionKind> { { "new@foo.ch", PermissionKind.Read } }
      }
    );

    // then
    IJournal journal = (await _repo.GetJournal("journal-id"))!;
    journal.Permissions.Should().ContainKey("owner-id");
    journal.Permissions.Should().ContainKey("new-id");

    result.EntityId.Should().Be("journal-id");
    result.AffectedUserIds.Should().BeEquivalentTo("owner-id", "new-id");
  }

  [Test]
  public async Task LeavePermissionsUnchanged_When_NoPermissionsProvided()
  {
    // given
    _repo.Journals.Add(
      new CounterJournal
      {
        Id = "journal-id",
        Permissions = new UserPermissions { { "owner-id", new PermissionDefinition { Kind = PermissionKind.Write } } }
      }
    );

    // when
    CommandResult result = await new EditJournalPermissionsCommandExecutor(_repo).Execute(
      new EditJournalPermissionsCommand { JournalId = "journal-id" }
    );

    // then
    IJournal journal = (await _repo.GetJournal("journal-id"))!;
    journal.Permissions.Should().ContainKey("owner-id");
    result.AffectedUserIds.Should().BeEquivalentTo("owner-id");
  }
}
