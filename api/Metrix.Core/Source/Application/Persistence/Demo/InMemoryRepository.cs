using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Metrix.Core.Domain.Permissions;
using Metrix.Core.Domain.User;

namespace Metrix.Core.Application.Persistence.Demo;

public class InMemoryRepository : IRepository
{
  public List<IUser> Users { get; } = new();

  public List<IMeasurement> Measurements { get; } = new();

  public List<IMetric> Metrics { get; } = new();

  public Task<IUser?> GetUser(string name)
  {
    return Task.FromResult(Users.FirstOrDefault(u => u.Name == name));
  }

  public Task<UpsertResult> UpsertUser(IUser user)
  {
    if (string.IsNullOrEmpty(user.Id))
    {
      user.Id = GenerateId();
    }
    else
    {
      RemoveUser(user);
    }

    Users.Add(user.Copy());

    return Task.FromResult(new UpsertResult { EntityId = user.Id });
  }

  public async Task<IUser[]> GetUsers(string[] userIds)
  {
    IUser[] allUsers = await GetAllUsers();
    return allUsers.Where(u => userIds.Contains(u.Id)).ToArray();
  }

  public Task<IUser[]> GetAllUsers()
  {
    return Task.FromResult(Users.Select(u => u.Copy()).ToArray());
  }

  public Task<IMetric[]> GetAllMetrics()
  {
    return Task.FromResult(Metrics.Select(m => m.Copy()).ToArray());
  }

  public Task<IMetric?> GetMetric(string metricId)
  {
    return Task.FromResult(Metrics.FirstOrDefault(m => m.Id == metricId).Copy());
  }

  public Task<IMeasurement[]> GetAllMeasurements(
    string metricId,
    DateTime? fromDate,
    DateTime? toDate,
    IDictionary<string, string[]> attributeValues
    )
  {
    return Task.FromResult(
      Measurements.Where(m => m.MetricId == metricId)
        .Select(m => m.Copy())
        .ToArray()
    );
  }

  public Task<UpsertResult> UpsertMetric(IMetric metric)
  {
    if (string.IsNullOrEmpty(metric.Id))
    {
      metric.Id = GenerateId();
    }
    else
    {
      RemoveMetric(metric);
    }

    Metrics.Add(metric.Copy());

    return Task.FromResult(new UpsertResult { EntityId = metric.Id });
  }

  public async Task ModifyMetricPermissions(string metricId, Dictionary<string, PermissionKind> permissions)
  {
    IMetric? metric = await GetMetric(metricId);
    if (metric == null)
    {
      return;
    }

    var permissionsEnsurer = new PermissionsEnsurer(this, UpsertUser);
    await permissionsEnsurer.EnsurePermissions(metric, permissions);

    await UpsertMetric(metric);
  }

  public async Task<UpsertResult> UpsertMeasurement<TMeasurement>(TMeasurement measurement)
    where TMeasurement : IMeasurement
  {
    if (string.IsNullOrEmpty(measurement.Id))
    {
      measurement.Id = GenerateId();
    }
    else
    {
      await DeleteMeasurement(measurement.Id);
    }

    Measurements.Add(measurement.Copy());

    return new UpsertResult { EntityId = measurement.Id };
  }

  public async Task DeleteMeasurement(string measurementId)
  {
    if (string.IsNullOrEmpty(measurementId))
    {
      return;
    }

    IMeasurement? measurement = await GetMeasurement(measurementId);
    if (measurement == null)
    {
      return;
    }

    Measurements.Remove(measurement);
  }

  public Task<IMeasurement?> GetMeasurement(string measurementId)
  {
    return Task.FromResult(Measurements.FirstOrDefault(m => m.Id == measurementId));
  }

  private void RemoveMetric<TMetric>(TMetric metric) where TMetric : IMetric
  {
    if (string.IsNullOrEmpty(metric.Id))
    {
      return;
    }

    IMetric? firstOrDefault = Metrics.FirstOrDefault(m => m.Id == metric.Id);
    if (firstOrDefault == null)
    {
      return;
    }

    Metrics.Remove(firstOrDefault);
  }

  private void RemoveUser(IUser user)
  {
    if (string.IsNullOrEmpty(user.Name))
    {
      return;
    }

    IUser? firstOrDefault = Users.FirstOrDefault(m => m.Name == user.Name);
    if (firstOrDefault == null)
    {
      return;
    }

    Users.Remove(firstOrDefault);
  }

  private string GenerateId()
  {
    return Guid.NewGuid().ToString("N");
  }
}
