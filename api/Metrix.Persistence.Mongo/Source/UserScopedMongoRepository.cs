using Metrix.Core.Application;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain;
using Metrix.Core.Domain.Metrics;
using Metrix.Core.Domain.Permissions;
using Metrix.Core.Domain.User;
using Metrix.Persistence.Mongo.DocumentTypes;
using MongoDB.Driver;

namespace Metrix.Persistence.Mongo;

public class UserScopedMongoRepository : MongoRepository, IUserScopedRepository
{
  private readonly ICurrentUserService _currentUserService;

  public Lazy<IUser> CurrentUser => new(LoadUser);

  public UserScopedMongoRepository(
    IMongoRepositorySettings settings,
    ICurrentUserService currentUserService
    )
    : base(settings)
  {
    _currentUserService = currentUserService;
  }

  public override async Task<IUser?> GetUser(string? name)
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
    ValidateUser(user.Id);
    return await base.UpsertUser(user);
  }

  public override async Task<UpsertResult> UpsertMetric(IMetric metric)
  {
    EnsureValidUser(metric);
    await EnsureUserHasPermission(metric.Id, PermissionKind.Write);
    return await base.UpsertMetric(metric);
  }

  public override async Task<UpsertResult> UpsertMeasurement<TMeasurement>(TMeasurement measurement)
  {
    EnsureValidUser(measurement);
    await EnsureUserHasPermission(measurement.MetricId, PermissionKind.Write);
    return await base.UpsertMeasurement(measurement);
  }

  private async Task EnsureUserHasPermission(string? metricId, PermissionKind kind)
  {
    if (string.IsNullOrEmpty(metricId))
    {
      return;
    }

    IMetric? metric = await GetMetric(metricId, kind);
    if (metric == null)
    {
      throw new UnallowedOperationException("Metric doesn't exist or you do not have permissions.");
    }
  }

  protected override FilterDefinition<TDocument> GetAllMetricDocumentsFilter<TDocument>(PermissionKind kind)
  {
    string? userId = CurrentUser.Value.Id;
    EnsureUserNameIsSet(userId);

    // for current user we do not care which PermissionKind is requested, as if user
    // is owner, then everything is allowed.
    FilterDefinition<TDocument> currentUserFilter = GetCurrentUserFilter<TDocument>(userId);

    if (typeof(TDocument).IsAssignableTo(typeof(IHasPerissionsDocument)))
    {
      return Builders<TDocument>.Filter.Or(currentUserFilter, GetHasPermissionsFilter<TDocument>(userId, kind));
    }

    return currentUserFilter;
  }

  private static FilterDefinition<TDocument> GetHasPermissionsFilter<TDocument>(
    string? userId,
    PermissionKind permissionKind
    )
  {
    return Builders<TDocument>.Filter.Gte(
      nameof(IHasPerissionsDocument.Permissions) + "." + userId,
      permissionKind
    );
  }

  private static FilterDefinition<TDocument> GetCurrentUserFilter<TDocument>(string? userId)
  {
    return Builders<TDocument>.Filter.Eq(nameof(IUserScopedDocument.UserId), userId);
  }

  private void EnsureValidUser(IUserScoped entity)
  {
    if (string.IsNullOrEmpty(entity.UserId))
    {
      entity.UserId = CurrentUser.Value.Id;
    }

    ValidateUser(entity.UserId);
  }

  private IUser LoadUser()
  {
    string? name = _currentUserService.GetUserName();
    EnsureUserNameIsSet(name);

    IUser? result = base.GetUser(name).Result;
    if (result == null)
    {
      throw new UnallowedOperationException($"Current user '{name}' does not exist.");
    }

    return result;
  }

  private void ValidateUser(string? entityUserId)
  {
    if (entityUserId != CurrentUser.Value.Id)
    {
      throw new UnallowedOperationException("Entity does not belong to current user.");
    }
  }

  private static void EnsureUserNameIsSet(string? name)
  {
    if (string.IsNullOrEmpty(name))
    {
      throw new UnallowedOperationException($"Current user is not available.");
    }
  }
}
