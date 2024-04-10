using System.Collections.Generic;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Users;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Domain.Permissions;

public class PermissionsEnsurerShould
{
  private PermissionsEnsurer _permissionsEnsurer = null!;
  private IBaseRepository _repository = null!;

  [SetUp]
  public void SetUp()
  {
    _repository = new InMemoryRepository
    {
      Users =
      {
        new User
        {
          Id = "123",
          Name = "mar@foo.ch",
          DisplayName = "Mar Dog"
        }
      }
    };

    _permissionsEnsurer = new PermissionsEnsurer(_repository, _repository.UpsertUser);
  }

  [Test]
  public async Task RemovePermissions_When_None()
  {
    var holder = new TestPermissionHolder
    {
      Permissions = new UserPermissions { { "123", new PermissionDefinition { Kind = PermissionKind.Read } } }
    };

    await _permissionsEnsurer.EnsurePermissions(
      holder,
      new Dictionary<string, PermissionKind> { { "mar@foo.ch", PermissionKind.None } }
    );

    holder.Permissions.Count.Should().Be(0);
  }

  [Test]
  public async Task ChangePermissions_When_AlreadySet()
  {
    var holder = new TestPermissionHolder
    {
      Permissions = new UserPermissions { { "123", new PermissionDefinition { Kind = PermissionKind.Read } } }
    };

    await _permissionsEnsurer.EnsurePermissions(
      holder,
      new Dictionary<string, PermissionKind> { { "mar@foo.ch", PermissionKind.Write } }
    );

    holder.Permissions.Count.Should().Be(1);
    holder.Permissions["123"].Kind.Should().Be(PermissionKind.Write);
  }

  [Test]
  public async Task AddPermissions_When_NotThereYet()
  {
    var holder = new TestPermissionHolder
    {
      Permissions = new UserPermissions { { "123", new PermissionDefinition { Kind = PermissionKind.Read } } }
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
