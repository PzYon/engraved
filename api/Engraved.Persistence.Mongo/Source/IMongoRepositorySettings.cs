namespace Engraved.Persistence.Mongo;

public interface IMongoRepositorySettings
{
  string MongoDbConnectionString { get; }
  string DatabaseName { get; }
  string JournalsCollectionName { get; }
  string EntriesCollectionName { get; }
  string UsersCollectionName { get; }
}
