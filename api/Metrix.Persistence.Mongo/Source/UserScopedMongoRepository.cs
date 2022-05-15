using Metrix.Core.Application;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain;
using Metrix.Core.Domain.User;
using Metrix.Persistence.Mongo.DocumentTypes.Metrics;
using MongoDB.Driver;

namespace Metrix.Persistence.Mongo;

public class UserScopedMongoRepository : MongoRepository, IUserScopedRepository
{
  private readonly ICurrentUserService _currentUserService;

  public Lazy<IUser> CurrentUser => new(() => base.GetUser(_currentUserService.GetUserName()).Result);

  public UserScopedMongoRepository(
    IMongoRepositorySettings settings,
    ICurrentUserService currentUserService
    )
    : base(settings)
  {
    _currentUserService = currentUserService;
  }

  public override async Task<IUser?> GetUser(string name)
  {
    IUser? user = await base.GetUser(name);

    if (user != null && user.Id != CurrentUser.Value.Id)
    {
      return null;
    }

    return user;
  }

  public override async Task<UpsertResult> UpsertUser(IUser user)
  {
    if (user.Id != CurrentUser.Value.Id)
    {
      throw new UnallowedOperationException();
    }

    return await base.UpsertUser(user);
  }

  protected override FilterDefinition<MetricDocument> GetAllMetricsFilter()
  {
    return Builders<MetricDocument>.Filter.Eq(nameof(IUserScoped.UserId), CurrentUser.Value.Id);
  }

  /*

  Task<IMetric?> GetMetric(string metricId);

  Task<IMeasurement[]> GetAllMeasurements(string metricId);

  Task<UpsertResult> UpsertMetric(IMetric metric);

  Task<UpsertResult> UpsertMeasurement<TMeasurement>(TMeasurement measurement) where TMeasurement : IMeasurement;
  */
}
