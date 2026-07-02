using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Queries.Journals;

public class JournalQueryUtilShould
{
  private string _meUserId = null!;
  private TestMongoRepository _testRepository = null!;
  private TestUserRestrictedMongoRepository _userRestrictedMongoRepository = null!;
  private string _youUserId = null!;

  [SetUp]
  public async Task SetUp()
  {
    _testRepository = await Util.CreateMongoRepository();

    UpsertResult meUpsertResult = await _testRepository.UpsertUser(new User { Name = "me" });
    _meUserId = meUpsertResult.EntityId;

    UpsertResult youUpsertResult = await _testRepository.UpsertUser(new User { Name = "you" });
    _youUserId = youUpsertResult.EntityId;

    _userRestrictedMongoRepository = await Util.CreateUserRestrictedMongoRepository("me", _meUserId, true);
  }

  [Test]
  public async Task SetUserRoleToOwner()
  {
    IJournal[] ensuredJournals = await JournalQueryUtil.EnsurePermissionUsers(
      _userRestrictedMongoRepository,
      new TimerJournal { UserId = _meUserId }
    );

    ensuredJournals.Length.Should().Be(1);
    ensuredJournals[0].Permissions[_meUserId].UserRole.Should().Be(UserRole.Owner);
  }

  [Test]
  public async Task SetUserRoleToReader()
  {
    IJournal[] ensuredJournals = await JournalQueryUtil.EnsurePermissionUsers(
      _userRestrictedMongoRepository,
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

    ensuredJournals.Length.Should().Be(1);
    ensuredJournals[0].Permissions[_meUserId].UserRole.Should().Be(UserRole.Reader);
  }

  [Test]
  public async Task SetUserRoleToWriter()
  {
    IJournal[] ensuredJournals = await JournalQueryUtil.EnsurePermissionUsers(
      _userRestrictedMongoRepository,
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

    ensuredJournals.Length.Should().Be(1);
    ensuredJournals[0].Permissions[_meUserId].UserRole.Should().Be(UserRole.Writer);
  }
}
