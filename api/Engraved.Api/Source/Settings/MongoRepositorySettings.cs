using Engraved.Persistence.Mongo;

namespace Engraved.Api.Settings;

public class MongoRepositorySettings : IMongoRepositorySettings
{
  public MongoRepositorySettings(string connectionString)
  {
    MongoDbConnectionString = connectionString;
  }

  public string MongoDbConnectionString { get; }

  // attention: renaming stuff in an azure cosmos db is literally not possible!!
  public string DatabaseName => "metrix_test";
  public string JournalsCollectionName => "metrics";
  public string EntriesCollectionName => "measurements";
  public string UsersCollectionName => "users";
}
