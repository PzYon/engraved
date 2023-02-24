using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Metrics;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.User;
using Engraved.Persistence.Mongo.DocumentTypes;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo;

public class UserScopedMongoRepository : MongoRepository, IUserScopedRepository
{
  private readonly ICurrentUserService _currentUserService;

  public Lazy<IUser> CurrentUser { get; }

  public UserScopedMongoRepository(
    IMongoRepositorySettings settings,
    ICurrentUserService currentUserService
  )
    : base(settings)
  {
    _currentUserService = currentUserService;
    CurrentUser = new Lazy<IUser>(LoadUser);
  }

  public override async Task<UpsertResult> UpsertUser(IUser user)
  {
    EnsureEntityBelongsToUser(user.Id);
    return await base.UpsertUser(user);
  }

  public override async Task<UpsertResult> UpsertMetric(IMetric metric)
  {
    EnsureUserId(metric);
    await EnsureUserHasPermission(metric.Id, PermissionKind.Write);
    return await base.UpsertMetric(metric);
  }

  public override async Task<UpsertResult> UpsertMeasurement<TMeasurement>(TMeasurement measurement)
  {
    EnsureUserId(measurement);
    await EnsureUserHasPermission(measurement.MetricId, PermissionKind.Write);
    return await base.UpsertMeasurement(measurement);
  }

  public override async Task DeleteMetric(string metricId)
  {
    await EnsureUserHasPermission(metricId, PermissionKind.Write);
    await base.DeleteMetric(metricId);
  }

  protected override FilterDefinition<TDocument> GetAllMetricDocumentsFilter<TDocument>(PermissionKind kind)
  {
    string? userId = CurrentUser.Value.Id;
    EnsureUserIsSet(userId);

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
      string.Join(".", nameof(IHasPerissionsDocument.Permissions), userId, nameof(PermissionDefinition.Kind)),
      permissionKind
    );
  }

  private static FilterDefinition<TDocument> GetCurrentUserFilter<TDocument>(string? userId)
  {
    return Builders<TDocument>.Filter.Eq(nameof(IUserScopedDocument.UserId), userId);
  }

  private IUser LoadUser()
  {
    string? name = _currentUserService.GetUserName();
    EnsureUserIsSet(name);

    IUser? result = base.GetUser(name).Result;
    if (result == null)
    {
      throw new NotAllowedOperationException($"Current user '{name}' does not exist.");
    }

    return result;
  }

  private void EnsureUserId(IUserScoped entity)
  {
    if (string.IsNullOrEmpty(entity.UserId))
    {
      entity.UserId = CurrentUser.Value.Id;
    }
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
      throw new NotAllowedOperationException("Metric doesn't exist or you do not have permissions.");
    }
  }

  private void EnsureEntityBelongsToUser(string? entityUserId)
  {
    if (entityUserId != CurrentUser.Value.Id)
    {
      throw new NotAllowedOperationException("Entity does not belong to current user.");
    }
  }

  private static void EnsureUserIsSet(string? nameOrId)
  {
    if (string.IsNullOrEmpty(nameOrId))
    {
      throw new NotAllowedOperationException($"Current user is not available.");
    }
  }
}
