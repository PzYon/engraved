using Metrix.Persistence.Mongo.DocumentTypes.Measurements;
using Metrix.Persistence.Mongo.DocumentTypes.Metrics;
using Metrix.Persistence.Mongo.DocumentTypes.Users;
using MongoDB.Driver;

namespace Metrix.Persistence.Mongo.Tests;

public class TestMongoRepository : MongoRepository
{
  public IMongoCollection<MetricDocument> Metrics => _metrics;
  public IMongoCollection<MeasurementDocument> Measurements => _measurements;
  public IMongoCollection<UserDocument> Users => _users;
  
  public TestMongoRepository(IMongoRepositorySettings settings) : base(settings) { }
}