using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Queries.Journals;

public static class JournalQueryUtil
{
  public static async Task<IJournal[]> EnsurePermissionUsers(
    IUserRepository repository,
    params IJournal[] journals
  )
  {
    var distinctUserIds = journals
      .SelectMany(m => m.Permissions.Keys)
      .Union(journals.Where(m => !string.IsNullOrEmpty(m.UserId)).Select(m => m.UserId!))
      .Distinct()
      .ToArray();

    var users = await repository.GetUsers(distinctUserIds);

    var userById = users.ToDictionary(u => u.Id!, ToPermissionUser);

    return journals.Select(j => EnsureUsers(j, userById)).ToArray();
  }

  private static PermissionUser ToPermissionUser(IUser user)
  {
    return new PermissionUser
    {
      Id = user.Id,
      Name = user.Name,
      DisplayName = user.DisplayName,
      ImageUrl = user.ImageUrl
    };
  }

  private static IJournal EnsureUsers(IJournal journal, IReadOnlyDictionary<string, PermissionUser> userById)
  {
    // write all users on to object
    foreach ((var key, PermissionDefinition value) in journal.Permissions)
    {
      value.User = userById[key];
      value.UserRole = journal.UserId == key
        ? UserRole.Owner
        : value.Kind == PermissionKind.Write
          ? UserRole.Writer
          : UserRole.Reader;
    }

    var journalOwnerId = journal.UserId!;

    journal.Permissions.TryAdd(
      journalOwnerId,
      new PermissionDefinition
      {
        User = userById[journalOwnerId],
        UserRole = UserRole.Owner,
        Kind = PermissionKind.Write
      }
    );

    return journal;
  }
}
