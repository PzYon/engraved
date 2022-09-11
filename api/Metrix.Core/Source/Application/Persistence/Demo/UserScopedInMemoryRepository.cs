using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Metrix.Core.Domain.Permissions;
using Metrix.Core.Domain.User;

namespace Metrix.Core.Application.Persistence.Demo;

// we need test users!
/*
new User
    {
      Id = "markus.doggweiler@gmail.com",
      Name = "markus.doggweiler@gmail.com",
      DisplayName = "Mar Dog",
      ImageUrl = "https://lh3.googleusercontent.com/a-/AOh14Gg94v3JIJeHjaTjU0_QTccEhr4-H8o358PN7odm2g=s96-c"
    }
 */

public class UserScopedInMemoryRepository : IUserScopedRepository
{
  private readonly IRepository _repository;
  private readonly ICurrentUserService _currentUserService;

  public Lazy<IUser> CurrentUser => new(LoadUser);

  public UserScopedInMemoryRepository(IRepository repository, ICurrentUserService currentUserService)
  {
    _repository = repository;
    _currentUserService = currentUserService;
  }

  public Task<IUser?> GetUser(string name)
  {
    return _repository.GetUser(name);
  }

  public Task<UpsertResult> UpsertUser(IUser user)
  {
    return _repository.UpsertUser(user);
  }

  public Task<IUser[]> GetUsers(string[] userIds)
  {
    return _repository.GetAllUsers();
  }

  public async Task<IUser[]> GetAllUsers()
  {
    return (await _repository.GetAllUsers())
      .Where(u => u.Id == CurrentUser.Value.Id)
      .ToArray();
  }

  public async Task<IMetric[]> GetAllMetrics()
  {
    IMetric[] allMetrics = await _repository.GetAllMetrics();
    return allMetrics
      .Where(m => m.UserId == CurrentUser.Value.Id)
      .ToArray();
  }

  public async Task<IMetric?> GetMetric(string metricId)
  {
    IMetric? metric = await _repository.GetMetric(metricId);
    return metric?.UserId == CurrentUser.Value.Id ? metric : null;
  }

  public async Task<IMeasurement[]> GetAllMeasurements(
    string metricId,
    DateTime? fromDate,
    DateTime? toDate,
    IDictionary<string, string[]> attributeValues
    )
  {
    return (await _repository.GetAllMeasurements(metricId, fromDate, toDate, attributeValues))
      .Where(m => m.UserId == CurrentUser.Value.Id)
      .ToArray();
  }

  public Task<UpsertResult> UpsertMetric(IMetric metric)
  {
    metric.UserId = CurrentUser.Value.Id;
    return _repository.UpsertMetric(metric);
  }

  public async Task ModifyMetricPermissions(string metricId, Dictionary<string, PermissionKind> permissions)
  {
    IMetric? metric = await GetMetric(metricId);
    if (metric == null)
    {
      throw new Exception("Does not exist or no access");
    }

    await _repository.ModifyMetricPermissions(metricId, permissions);
  }

  public Task<UpsertResult> UpsertMeasurement<TMeasurement>(TMeasurement measurement) where TMeasurement : IMeasurement
  {
    measurement.UserId = CurrentUser.Value.Id;
    return _repository.UpsertMeasurement(measurement);
  }

  public async Task DeleteMeasurement(string measurementId)
  {
    // get measurement only returns if measurement belongs to current user
    IMeasurement? measurement = await GetMeasurement(measurementId);

    if (measurement == null)
    {
      return;
    }

    await _repository.DeleteMeasurement(measurementId);
  }

  public async Task<IMeasurement?> GetMeasurement(string measurementId)
  {
    IMeasurement? measurement = await _repository.GetMeasurement(measurementId);

    return measurement != null && measurement.UserId == CurrentUser.Value.Id
      ? measurement
      : null;
  }

  private IUser LoadUser()
  {
    string? name = _currentUserService.GetUserName();
    EnsureUserNameIsSet(name);

    IUser? result = _repository.GetUser(name!).Result;
    if (result == null)
    {
      throw new UnallowedOperationException($"Current user '{name}' does not exist.");
    }

    return result;
  }

  private static void EnsureUserNameIsSet(string? name)
  {
    if (string.IsNullOrEmpty(name))
    {
      throw new UnallowedOperationException($"Current user is not available.");
    }
  }
}
