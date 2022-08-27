using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.User;

namespace Metrix.Core.Domain.Permissions;

public static class PermissionsUtil
{
  public static async Task EnsurePermissions(
    IRepository repo,
    Func<IUser, Task<UpsertResult>> upsertUser,
    IHasPermissions permissionHolder,
    Permissions permissionsToEnsure
    )
  {
    foreach ((string? userName, PermissionKind permissionKind) in permissionsToEnsure)
    {
      string userId = await EnsureUserAndGetId(repo, upsertUser, userName);

      if (permissionKind == PermissionKind.None)
      {
        permissionHolder.Permissions.Remove(userId);
        return;
      }

      permissionHolder.Permissions[userId] = permissionKind;
    }
  }

  private static async Task<string> EnsureUserAndGetId(
    IRepository repo,
    Func<IUser, Task<UpsertResult>> upsertUser,
    string userName
    )
  {
    IUser? user = await repo.GetUser(userName);
    if (user != null)
    {
      return user.Id!;
    }

    UpsertResult result = await upsertUser(
      new User.User
      {
        Name = userName
      }
    );

    return result.EntityId;
  }
}
