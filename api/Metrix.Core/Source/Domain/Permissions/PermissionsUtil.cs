namespace Metrix.Core.Domain.Permissions;

public static class PermissionsUtil
{
  public static void EnsurePermissions(IHasPermissions permissionHolder, Permissions permissionsToEnsure)
  {
    foreach (KeyValuePair<string, PermissionKind> keyValuePair in permissionsToEnsure)
    {
      PermissionKind permissionKind = keyValuePair.Value;
      string userId = keyValuePair.Key;

      if (permissionKind == PermissionKind.None)
      {
        permissionHolder.Permissions.Remove(userId);
      }
      else
      {
        permissionHolder.Permissions[userId] = permissionKind;
      }
    }
  }
}
