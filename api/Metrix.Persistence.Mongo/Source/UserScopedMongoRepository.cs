using Metrix.Core.Application;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain;
using Metrix.Core.Domain.Metrics;
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
    return await base.UpsertMetric(metric);
  }

  public override async Task<UpsertResult> UpsertMeasurement<TMeasurement>(TMeasurement measurement)
  {
    EnsureValidUser(measurement);
    return await base.UpsertMeasurement(measurement);
  }

  protected override FilterDefinition<TDocument> GetAllDocumentsFilter<TDocument>()
  {
    string? userId = CurrentUser.Value.Id;
    EnsureUserNameIsSet(userId);

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
