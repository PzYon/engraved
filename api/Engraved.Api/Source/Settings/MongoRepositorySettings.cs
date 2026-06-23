using Engraved.Persistence.Mongo;

namespace Engraved.Api.Settings;

public class MongoRepositorySettings(string connectionString) : IMongoRepositorySettings
{
  public string MongoDbConnectionString { get; } = connectionString;

  // attention: renaming stuff in an azure cosmos db is literally not possible!!
  public string DatabaseName => "metrix_test";
  public string JournalsCollectionName => "metrics";
  public string EntriesCollectionName => "measurements";
  public string UsersCollectionName => "users";
}
