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
    List<string> userIds = journals
      .SelectMany(m => m.Permissions.Keys)
      .Union(
        journals.Where(m => !string.IsNullOrEmpty(m.UserId)).Select(m => m.UserId!)
      )
      .ToList();

    string[] distinctUserIds = userIds.Distinct().ToArray();

    IUser[] users = await repository.GetUsers(distinctUserIds);

    Dictionary<string, IUser> userById = users.ToDictionary(u => u.Id!, u => u);

    return journals.Select(j => EnsureUsers(repository.CurrentUser.Value, j, userById)).ToArray();
  }

  private static IJournal EnsureUsers(IUser currentUser, IJournal journal, IReadOnlyDictionary<string, IUser> userById)
  {
    foreach ((string? key, PermissionDefinition value) in journal.Permissions)
    {
      value.User = userById[key];
    }

    journal.UserRole = GetCurrentUserRole(journal.UserId, journal.Permissions, currentUser);

    // todo: we might need something like this so we have all the relevant
    // user's information on the client.
    // journal.User = userById[journal.UserId!];

    return journal;
  }

  private static UserRole GetCurrentUserRole(string ownerId, UserPermissions allUserPermissions, IUser currentUser)
  {
    if (ownerId == currentUser.Id)
    {
      return UserRole.Owner;
    }

    if (allUserPermissions.TryGetValue(currentUser.Id, out PermissionDefinition permissionDefinition))
    {
      return permissionDefinition.Kind == PermissionKind.Read
        ? UserRole.Reader
        : permissionDefinition.Kind == PermissionKind.Write
          ? UserRole.Writer
          : UserRole.None;
    }

    return UserRole.None;
  }
}
