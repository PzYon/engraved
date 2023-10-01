using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.User;

namespace Engraved.Core.Application.Queries.Journals;

public static class JournalQueryUtil
{
  public static async Task<IJournal[]> EnsurePermissionUsers(IRepository repository, params IJournal[] metrics)
  {
    List<string> userIds = metrics
      .SelectMany(m => m.Permissions.Keys)
      .Union(
        metrics.Where(m => !string.IsNullOrEmpty(m.UserId)).Select(m => m.UserId!)
      )
      .ToList();

    string[] distinctUserIds = userIds.Distinct().ToArray();

    IUser[] users = await repository.GetUsers(distinctUserIds);

    Dictionary<string, IUser> userById = users.ToDictionary(u => u.Id!, u => u);

    return metrics.Select(m => EnsureUsers(m, userById)).ToArray();
  }

  private static IJournal EnsureUsers(IJournal journal, IReadOnlyDictionary<string, IUser> userById)
  {
    foreach ((string? key, PermissionDefinition value) in journal.Permissions)
    {
      value.User = userById[key];
    }

    // todo: we might need something like this so we have all the relevant
    // user's information on the client.
    // metric.User = userById[metric.UserId!];

    return journal;
  }
}
