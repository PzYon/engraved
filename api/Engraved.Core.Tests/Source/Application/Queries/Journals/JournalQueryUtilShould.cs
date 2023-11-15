﻿using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.User;
using NUnit.Framework;

namespace Engraved.Core.Application.Queries.Journals;

public class JournalQueryUtilShould
{
  private InMemoryRepository _testRepository = null!;
  private UserScopedInMemoryRepository _userScopedInMemoryRepository = null!;

  private string _meUserId = null!;
  private string _youUserId = null!;

  [SetUp]
  public async Task SetUp()
  {
    _testRepository = new InMemoryRepository();

    UpsertResult meUpsertResult = await _testRepository.UpsertUser(new User { Name = "me" });
    _meUserId = meUpsertResult.EntityId;

    UpsertResult youUpsertResult = await _testRepository.UpsertUser(new User { Name = "you" });
    _youUserId = youUpsertResult.EntityId;

    _userScopedInMemoryRepository = new UserScopedInMemoryRepository(
      _testRepository,
      new FakeCurrentUserService("me")
    );
  }

  [Test]
  public async Task SetUserRoleToOwner()
  {
    IJournal[] ensuredJournals = await JournalQueryUtil.EnsurePermissionUsers(
      _userScopedInMemoryRepository,
      new TimerJournal { UserId = _meUserId }
    );

    Assert.AreEqual(1, ensuredJournals.Length);
    Assert.AreEqual(UserRole.Owner, ensuredJournals[0].UserRole);
  }

  [Test]
  public async Task SetUserRoleToReader()
  {
    IJournal[] ensuredJournals = await JournalQueryUtil.EnsurePermissionUsers(
      _userScopedInMemoryRepository,
      new TimerJournal
      {
        UserId = _youUserId,
        Permissions = new UserPermissions
        {
          {
            _meUserId,
            new PermissionDefinition { Kind = PermissionKind.Read, User = new User { Id = _meUserId } }
          }
        }
      }
    );

    Assert.AreEqual(1, ensuredJournals.Length);
    Assert.AreEqual(UserRole.Reader, ensuredJournals[0].UserRole);
  }
  
  [Test]
  public async Task SetUserRoleToWriter()
  {
    IJournal[] ensuredJournals = await JournalQueryUtil.EnsurePermissionUsers(
      _userScopedInMemoryRepository,
      new TimerJournal
      {
        UserId = _youUserId,
        Permissions = new UserPermissions
        {
          {
            _meUserId,
            new PermissionDefinition { Kind = PermissionKind.Write, User = new User { Id = _meUserId } }
          }
        }
      }
    );

    Assert.AreEqual(1, ensuredJournals.Length);
    Assert.AreEqual(UserRole.Writer, ensuredJournals[0].UserRole);
  }
}
