using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.User;

namespace Engraved.Core.Application.Queries.Journals;

public static class JournalQueryUtil
{
  public static async Task<IJournal[]> EnsurePermissionUsers(
    IUserScopedRepository repository,
    params IJournal[] journals
  )
  {
    string[] distinctUserIds = journals
      .SelectMany(m => m.Permissions.Keys)
      .Union(
        journals.Where(m => !string.IsNullOrEmpty(m.UserId)).Select(m => m.UserId!)
      )
      .Distinct()
      .ToArray();

    IUser[] users = await repository.GetUsers(distinctUserIds);

    Dictionary<string, IUser> userById = users.ToDictionary(u => u.Id!, u => u);

    return journals.Select(j => EnsureUsers(repository.CurrentUser.Value, j, userById)).ToArray();
  }

  private static IJournal EnsureUsers(IUser currentUser, IJournal journal, IReadOnlyDictionary<string, IUser> userById)
  {
    // write all users on to object
    foreach ((string? key, PermissionDefinition value) in journal.Permissions)
    {
      value.User = userById[key];
    }

    // get current user role
    journal.UserRole = GetCurrentUserRole(journal.UserId!, journal.Permissions, currentUser);

    // todo: consider removing/clearing "private" data like
    // lastLoginDate and favoriteJournalids
    // -> if this is done, then add a unit test for this!

    return journal;
  }

  private static UserRole GetCurrentUserRole(string ownerId, UserPermissions allUserPermissions, IUser currentUser)
  {
    if (ownerId == currentUser.Id)
    {
      return UserRole.Owner;
    }

    if (allUserPermissions.TryGetValue(currentUser.Id!, out PermissionDefinition? permissionDefinition))
    {
      return permissionDefinition.Kind switch
      {
        PermissionKind.Read => UserRole.Reader,
        PermissionKind.Write => UserRole.Writer,
        _ => UserRole.None
      };
    }

    return UserRole.None;
  }
}
