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
      value.UserRole = journal.UserId == key
        ? UserRole.Owner
        : value.Kind == PermissionKind.Write
          ? UserRole.Writer
          : UserRole.Reader;
    }

    string journalOwnerId = journal.UserId!;

    if (!journal.Permissions.ContainsKey(journalOwnerId))
    {
      journal.Permissions[journalOwnerId] = new PermissionDefinition
      {
        User = userById[journalOwnerId],
        UserRole = UserRole.Owner,
        Kind = PermissionKind.Write
      };
    }

    // todo: consider removing/clearing "private" data like
    // lastLoginDate and favoriteJournalids
    // -> if this is done, then add a unit test for this!

    return journal;
  }
}
