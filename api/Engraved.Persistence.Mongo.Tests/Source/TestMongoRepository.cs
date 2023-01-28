using Engraved.Persistence.Mongo.DocumentTypes.Measurements;
using Engraved.Persistence.Mongo.DocumentTypes.Metrics;
using Engraved.Persistence.Mongo.DocumentTypes.Users;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo.Tests;

public class TestMongoRepository : MongoRepository
{
  public IMongoCollection<MetricDocument> Metrics => _metrics;
  public IMongoCollection<MeasurementDocument> Measurements => _measurements;
  public IMongoCollection<UserDocument> Users => _users;

  public TestMongoRepository(IMongoRepositorySettings settings) : base(settings) { }
}
