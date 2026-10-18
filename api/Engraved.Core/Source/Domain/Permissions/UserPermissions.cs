namespace Engraved.Core.Domain.Permissions;

public class UserPermissions : Dictionary<string, PermissionDefinition>
{
  public string[] GetUserIdsWithAccess()
  {
    return this.Where(p => p.Value.Kind != PermissionKind.None)
      .Select(p => p.Key)
      .ToArray();
  }
}
