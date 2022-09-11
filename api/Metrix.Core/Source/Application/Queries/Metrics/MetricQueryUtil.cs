using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Metrics;
using Metrix.Core.Domain.Permissions;
using Metrix.Core.Domain.User;

namespace Metrix.Core.Application.Queries.Metrics;

public static class MetricQueryUtil
{
  public static async Task<IMetric[]> EnsurePermissionUsers(IRepository repository, params IMetric[] metrics)
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

  private static IMetric EnsureUsers(IMetric metric, IReadOnlyDictionary<string, IUser> userById)
  {
    foreach ((string? key, PermissionDefinition? value) in metric.Permissions)
    {
      value.User = userById[key];
    }

    // todo: we might need something like this so we have all the relevant
    // user's information on the client.
    // metric.User = userById[metric.UserId!];

    return metric;
  }
}
