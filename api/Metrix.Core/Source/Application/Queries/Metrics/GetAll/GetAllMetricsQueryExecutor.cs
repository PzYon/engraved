using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Metrics;
using Metrix.Core.Domain.Permissions;
using Metrix.Core.Domain.User;

namespace Metrix.Core.Application.Queries.Metrics.GetAll;

public class GetAllMetricsQueryExecutor : IQueryExecutor<IMetric[]>
{
  private readonly GetAllMetricsQuery _command;

  public GetAllMetricsQueryExecutor(GetAllMetricsQuery command)
  {
    _command = command;
  }

  public async Task<IMetric[]> Execute(IRepository repository)
  {
    IMetric[] allMetrics = await repository.GetAllMetrics();

    string[] userIds = allMetrics.SelectMany(m => m.Permissions.Keys).ToArray();
    IUser[] users = await repository.GetUsers(userIds);
    Dictionary<string, IUser> userById = users.ToDictionary(u => u.Id!, u => u);

    return allMetrics
      .OrderByDescending(m => m.LastMeasurementDate)
      .Select(m => EnsureUsers(m, userById))
      .ToArray();
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
