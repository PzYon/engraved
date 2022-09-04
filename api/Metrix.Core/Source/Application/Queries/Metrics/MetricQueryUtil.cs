using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Metrics;
using Metrix.Core.Domain.Permissions;
using Metrix.Core.Domain.User;

namespace Metrix.Core.Application.Queries.Metrics;

public static class MetricQueryUtil
{
  public static async Task<IMetric[]> EnsurePermissionUsers(IRepository repository, params IMetric[] metrics)
  {
    string[] userIds = metrics.SelectMany(m => m.Permissions.Keys).ToArray();
    IUser[] users = await repository.GetUsers(userIds);
    Dictionary<string, IUser> userById = users.ToDictionary(u => u.Id!, u => u);

    return metrics.Select(m => EnsureUsers(m, userById)).ToArray();
  }

  private static IMetric EnsureUsers(IMetric m, IReadOnlyDictionary<string, IUser> userById)
  {
    foreach ((string? key, PermissionDefinition? value) in m.Permissions)
    {
      value.User = userById[key];
    }

    return m;
  }
}
