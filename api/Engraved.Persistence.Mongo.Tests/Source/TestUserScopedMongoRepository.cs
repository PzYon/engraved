using Engraved.Core.Application;
using Engraved.Persistence.Mongo.DocumentTypes.Measurements;
using Engraved.Persistence.Mongo.DocumentTypes.Metrics;
using Engraved.Persistence.Mongo.DocumentTypes.Users;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo.Tests;

public class TestUserScopedMongoRepository : UserScopedMongoRepository
{
  public IMongoCollection<JournalDocument> Journals => JournalsCollection;
  public IMongoCollection<MeasurementDocument> Measurements => MeasurementsCollection;
  public IMongoCollection<UserDocument> Users => UsersCollection;

  public TestUserScopedMongoRepository(IMongoRepositorySettings settings, ICurrentUserService currentUserService) :
    base(settings, currentUserService) { }
}
