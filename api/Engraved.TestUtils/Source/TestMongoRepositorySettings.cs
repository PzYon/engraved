using Engraved.Persistence.Mongo;

namespace Engraved.TestUtils.Source;

public class TestMongoRepositorySettings(string mongoDbConnectionString) : IMongoRepositorySettings
{
  public string MongoDbConnectionString => mongoDbConnectionString;
  public string DatabaseName => "metrix_unit_test";
  public string JournalsCollectionName => "journals";
  public string EntriesCollectionName => "entries";
  public string UsersCollectionName => "users";
}
