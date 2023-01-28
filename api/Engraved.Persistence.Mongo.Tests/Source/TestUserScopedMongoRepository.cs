using Engraved.Core.Application;
using Engraved.Persistence.Mongo.DocumentTypes.Measurements;
using Engraved.Persistence.Mongo.DocumentTypes.Metrics;
using Engraved.Persistence.Mongo.DocumentTypes.Users;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo.Tests;

public class TestUserScopedMongoRepository : UserScopedMongoRepository
{
  public IMongoCollection<MetricDocument> Metrics => _metrics;
  public IMongoCollection<MeasurementDocument> Measurements => _measurements;
  public IMongoCollection<UserDocument> Users => _users;

  public TestUserScopedMongoRepository(IMongoRepositorySettings settings, ICurrentUserService currentUserService) :
    base(settings, currentUserService) { }
}
