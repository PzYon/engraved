using Metrix.Persistence.Mongo;

namespace Metrix.Api.Settings;

public class MongoRepositorySettings : IMongoRepositorySettings
{
  public string MongoDbConnectionString { get; }

  public string DatabaseName => "metrix_test";
  public string MetricsCollectionName => "metrics";
  public string MeasurementsCollectionName => "measurements";
  public string UsersCollectionName => "users";

  public MongoRepositorySettings(string connectionString)
  {
    MongoDbConnectionString = connectionString;
  }
}
