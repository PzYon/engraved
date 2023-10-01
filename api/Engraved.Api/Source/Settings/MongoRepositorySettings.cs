using Engraved.Persistence.Mongo;

namespace Engraved.Api.Settings;

public class MongoRepositorySettings : IMongoRepositorySettings
{
  public MongoRepositorySettings(string connectionString)
  {
    MongoDbConnectionString = connectionString;
  }

  public string MongoDbConnectionString { get; }

  public string DatabaseName => "metrix_test";
  public string JournalsCollectionName => "metrics";
  public string MeasurementsCollectionName => "measurements";
  public string UsersCollectionName => "users";
}
