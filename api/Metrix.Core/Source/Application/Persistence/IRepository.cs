using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Metrix.Core.Domain.Permissions;
using Metrix.Core.Domain.User;

namespace Metrix.Core.Application.Persistence;

public interface IRepository
{
  Task<IUser?> GetUser(string name);

  Task<UpsertResult> UpsertUser(IUser user);

  Task<IUser[]> GetUsers(params string[] userIds);

  Task<IUser[]> GetAllUsers();

  Task<IMetric[]> GetAllMetrics();

  Task<IMetric?> GetMetric(string metricId);

  Task<UpsertResult> UpsertMetric(IMetric metric);

  Task ModifyMetricPermissions(string metricId, Dictionary<string, PermissionKind> permissions);

  Task<IMeasurement[]> GetAllMeasurements(
    string metricId,
    DateTime? fromDate,
    DateTime? toDate,
    IDictionary<string, string[]>? attributeValues
  );

  Task<UpsertResult> UpsertMeasurement<TMeasurement>(TMeasurement measurement) where TMeasurement : IMeasurement;

  Task DeleteMeasurement(string measurementId);

  Task<IMeasurement?> GetMeasurement(string measurementId);
}
