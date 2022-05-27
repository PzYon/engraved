using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Metrix.Core.Domain.User;

namespace Metrix.Core.Application.Persistence.Demo;

public class UserScopedInMemoryRepository : IUserScopedRepository
{
  private readonly IRepository _repository;

  public Lazy<IUser> CurrentUser { get; }

  public UserScopedInMemoryRepository(IRepository repository, IUser currentUser)
  {
    _repository = repository;
    CurrentUser = new Lazy<IUser>(currentUser);
  }

  public Task<IUser?> GetUser(string name)
  {
    return _repository.GetUser(name);
  }

  public Task<UpsertResult> UpsertUser(IUser user)
  {
    return _repository.UpsertUser(user);
  }

  public async Task<IUser[]> GetAllUsers()
  {
    return (await _repository.GetAllUsers())
      .Where(u => u.Id == CurrentUser.Value.Id)
      .ToArray();
  }

  public async Task<IMetric[]> GetAllMetrics()
  {
    return (await _repository.GetAllMetrics())
      .Where(m => m.UserId == CurrentUser.Value.Id)
      .ToArray();
  }

  public async Task<IMetric?> GetMetric(string metricId)
  {
    IMetric? metric = await _repository.GetMetric(metricId);
    return metric?.UserId == CurrentUser.Value.Id ? metric : null;
  }

  public async Task<IMeasurement[]> GetAllMeasurements(string metricId)
  {
    return (await _repository.GetAllMeasurements(metricId))
      .Where(m => m.UserId == CurrentUser.Value.Id)
      .ToArray();
  }

  public Task<UpsertResult> UpsertMetric(IMetric metric)
  {
    metric.UserId = CurrentUser.Value.Id;
    return _repository.UpsertMetric(metric);
  }

  public Task<UpsertResult> UpsertMeasurement<TMeasurement>(TMeasurement measurement) where TMeasurement : IMeasurement
  {
    measurement.UserId = CurrentUser.Value.Id;
    return _repository.UpsertMeasurement(measurement);
  }
}
