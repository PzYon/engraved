namespace Metrix.Core.Domain.Permissions;

public static class PermissionsUtil
{
  public static void EnsurePermissions(IHasPermissions permissionHolder, Permissions permissionsToEnsure)
  {
    foreach ((string? userId, PermissionKind permissionKind) in permissionsToEnsure)
    {
      if (permissionKind == PermissionKind.None)
      {
        permissionHolder.Permissions.Remove(userId);
        return;
      }

      permissionHolder.Permissions[userId] = permissionKind;
    }
  }
}
