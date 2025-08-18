using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Domain.Permissions;

public class PermissionsEnsurer(
  IBaseRepository repo,
  Func<IUser, Task<UpsertResult>> upsertUser
)
{
  public async Task EnsurePermissions(
    IPermissionHolder permissionHolder,
    Dictionary<string, PermissionKind> permissionsToEnsure
  )
  {
    foreach ((var userName, PermissionKind kind) in permissionsToEnsure)
    {
      var userId = await EnsureUserAndGetId(userName);

      if (kind == PermissionKind.None)
      {
        permissionHolder.Permissions.Remove(userId);
        return;
      }

      permissionHolder.Permissions[userId] = new PermissionDefinition { Kind = kind };
    }
  }

  private async Task<string> EnsureUserAndGetId(string userName)
  {
    IUser? user = await repo.GetUser(userName);
    if (user != null)
    {
      return user.Id!;
    }

    UpsertResult result = await upsertUser(new User { Name = userName });

    return result.EntityId;
  }
}
