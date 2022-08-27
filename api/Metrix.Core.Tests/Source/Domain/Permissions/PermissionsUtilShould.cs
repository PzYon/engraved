using System.Threading.Tasks;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Persistence.Demo;
using NUnit.Framework;

namespace Metrix.Core.Domain.Permissions;

public class PermissionsUtilShould
{
  private static readonly IRepository _repository = new InMemoryRepository()
  {
    Users =
    {
      new User.User
      {
        Id = "123",
        Name = "mar@foo.ch",
        DisplayName = "Mar Dog"
      }
    }
  };

  [Test]
  public async Task RemovePermissions_When_None()
  {
    var holder = new TestPermissionHolder
    {
      Permissions = new Permissions { { "123", PermissionKind.Read } }
    };

    await PermissionsUtil.EnsurePermissions(
      _repository,
      _repository.UpsertUser,
      holder,
      new Permissions { { "mar@foo.ch", PermissionKind.None } }
    );

    Assert.AreEqual(0, holder.Permissions.Count);
  }

  [Test]
  public async Task ChangePermissions_When_AlreadySet()
  {
    var holder = new TestPermissionHolder
    {
      Permissions = new Permissions { { "123", PermissionKind.Read } }
    };

    await PermissionsUtil.EnsurePermissions(
      _repository,
      _repository.UpsertUser,
      holder,
      new Permissions { { "mar@foo.ch", PermissionKind.Write } }
    );

    Assert.AreEqual(1, holder.Permissions.Count);
    Assert.AreEqual(PermissionKind.Write, holder.Permissions["123"]);
  }

  [Test]
  public async Task AddPermissions_When_NotThereYet()
  {
    var holder = new TestPermissionHolder
    {
      Permissions = new Permissions { { "123", PermissionKind.Read } }
    };

    await PermissionsUtil.EnsurePermissions(
      _repository,
      _repository.UpsertUser,
      holder,
      new Permissions { { "bar@foo.ch", PermissionKind.Read } }
    );

    Assert.AreEqual(2, holder.Permissions.Count);
  }
}

public class TestPermissionHolder : IHasPermissions
{
  public Permissions Permissions { get; set; } = null!;
}
