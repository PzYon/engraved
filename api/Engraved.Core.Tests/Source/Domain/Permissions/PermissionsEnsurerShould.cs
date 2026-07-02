using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Engraved.TestUtils;
using Engraved.Core.Application.Permissions;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Domain.Permissions;

public class PermissionsEnsurerShould
{
  private PermissionsEnsurer _permissionsEnsurer = null!;
  private TestMongoRepository _repository = null!;

  [SetUp]
  public async Task SetUp()
  {
    _repository = await Util.CreateMongoRepository();

    await _repository.UpsertUser(
      new User
      {
        Id = TestIds.UserId,
        Name = "mar@foo.ch",
        DisplayName = "Mar Dog"
      }
    );

    _permissionsEnsurer = new PermissionsEnsurer(_repository, _repository.UpsertUser);
  }

  [Test]
  public async Task RemovePermissions_When_None()
  {
    var holder = new TestPermissionHolder
    {
      Permissions = new UserPermissions { { TestIds.UserId, new PermissionDefinition { Kind = PermissionKind.Read } } }
    };

    await _permissionsEnsurer.EnsurePermissions(
      holder,
      new Dictionary<string, PermissionKind> { { "mar@foo.ch", PermissionKind.None } }
    );

    holder.Permissions.Count.Should().Be(0);
  }

  [Test]
  public async Task ProcessRemainingUsers_After_RemovingPermissions_With_None()
  {
    var holder = new TestPermissionHolder
    {
      Permissions = new UserPermissions { { TestIds.UserId, new PermissionDefinition { Kind = PermissionKind.Read } } }
    };

    // the None entry must not abort processing of the entries after it
    await _permissionsEnsurer.EnsurePermissions(
      holder,
      new Dictionary<string, PermissionKind>
      {
        { "mar@foo.ch", PermissionKind.None },
        { "bar@foo.ch", PermissionKind.Write }
      }
    );

    holder.Permissions.Count.Should().Be(1);
    holder.Permissions.Should().NotContainKey(TestIds.UserId);
    holder.Permissions.Single().Value.Kind.Should().Be(PermissionKind.Write);
  }

  [Test]
  public async Task ChangePermissions_When_AlreadySet()
  {
    var holder = new TestPermissionHolder
    {
      Permissions = new UserPermissions { { TestIds.UserId, new PermissionDefinition { Kind = PermissionKind.Read } } }
    };

    await _permissionsEnsurer.EnsurePermissions(
      holder,
      new Dictionary<string, PermissionKind> { { "mar@foo.ch", PermissionKind.Write } }
    );

    holder.Permissions.Count.Should().Be(1);
    holder.Permissions[TestIds.UserId].Kind.Should().Be(PermissionKind.Write);
  }

  [Test]
  public async Task AddPermissions_When_NotThereYet()
  {
    var holder = new TestPermissionHolder
    {
      Permissions = new UserPermissions { { TestIds.UserId, new PermissionDefinition { Kind = PermissionKind.Read } } }
    };

    await _permissionsEnsurer.EnsurePermissions(
      holder,
      new Dictionary<string, PermissionKind> { { "bar@foo.ch", PermissionKind.Read } }
    );

    holder.Permissions.Count.Should().Be(2);
  }
}

public class TestPermissionHolder : IPermissionHolder
{
  public UserRole UserRole { get; set; }
  public UserPermissions Permissions { get; set; } = null!;
}
