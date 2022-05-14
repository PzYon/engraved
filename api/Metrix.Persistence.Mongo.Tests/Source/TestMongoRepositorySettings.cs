namespace Metrix.Persistence.Mongo.Tests;

public class TestMongoRepositorySettings : IMongoRepositorySettings
{
  public string MongoDbConnectionString => "mongodb://localhost:27017";
  public string DatabaseName => "metrix_test";
  public string MetricsCollectionName => "metrics";
  public string MeasurementsCollectionName => "measurements";
  public string UsersCollectionName => "users";
}
