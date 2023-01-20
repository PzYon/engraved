using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.User;

namespace Metrix.Core.Domain.Permissions;

public class PermissionsEnsurer
{
  private readonly IRepository _repo;
  private readonly Func<IUser, Task<UpsertResult>> _upsertUser;

  public PermissionsEnsurer(
    IRepository repo,
    Func<IUser, Task<UpsertResult>> upsertUser
  )
  {
    _repo = repo;
    _upsertUser = upsertUser;
  }

  public async Task EnsurePermissions(
    IPermissionHolder permissionHolder,
    Dictionary<string, PermissionKind> permissionsToEnsure
  )
  {
    foreach ((string? userName, PermissionKind kind) in permissionsToEnsure)
    {
      string userId = await EnsureUserAndGetId(userName);

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
    IUser? user = await _repo.GetUser(userName);
    if (user != null)
    {
      return user.Id!;
    }

    UpsertResult result = await _upsertUser(new User.User { Name = userName });

    return result.EntityId;
  }
}
