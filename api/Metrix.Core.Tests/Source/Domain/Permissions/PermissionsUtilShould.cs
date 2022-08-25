using NUnit.Framework;

namespace Metrix.Core.Domain.Permissions;

public class PermissionsUtilShould
{
  [Test]
  public void RemovePermissions_When_None()
  {
    var holder = new TestPermissionHolder
    {
      Permissions = new Permissions { { "mar@foo.ch", PermissionKind.Read } }
    };

    PermissionsUtil.EnsurePermissions(
      holder,
      new Permissions { { "mar@foo.ch", PermissionKind.None } }
    );

    Assert.AreEqual(0, holder.Permissions.Count);
  }

  [Test]
  public void ChangePermissions_When_AlreadySet()
  {
    var holder = new TestPermissionHolder
    {
      Permissions = new Permissions { { "mar@foo.ch", PermissionKind.Read } }
    };

    PermissionsUtil.EnsurePermissions(
      holder,
      new Permissions { { "mar@foo.ch", PermissionKind.Write } }
    );

    Assert.AreEqual(1, holder.Permissions.Count);
    Assert.AreEqual(PermissionKind.Write, holder.Permissions["mar@foo.ch"]);
  }

  [Test]
  public void AddPermissions_When_NotThereYet()
  {
    var holder = new TestPermissionHolder
    {
      Permissions = new Permissions { { "mar@foo.ch", PermissionKind.Read } }
    };

    PermissionsUtil.EnsurePermissions(
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
