namespace Engraved.Persistence.Mongo;

public interface IMongoRepositorySettings
{
  string MongoDbConnectionString { get; }
  string DatabaseName { get; }
  string JournalsCollectionName { get; }
  string MeasurementsCollectionName { get; }
  string UsersCollectionName { get; }
}
