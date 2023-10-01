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
  public string JournalsCollectionName => "journals";
  public string EntriesCollectionName => "entries";
  public string UsersCollectionName => "users";
}
