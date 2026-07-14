using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Permissions;

public class PermissionsEnsurer(IUserRepository repo)
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
        continue;
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

    UpsertResult result = await repo.UpsertUser(new User { Name = userName });

    return result.EntityId;
  }
}
