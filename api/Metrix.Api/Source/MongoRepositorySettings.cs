using Metrix.Persistence.Mongo;

public class MongoRepositorySettings : IMongoRepositorySettings
{
  public string MongoDbConnectionString => "mongodb://localhost:27017";
  public string DatabaseName => "metrix_test";
  public string MetricsCollectionName => "metrics";
  public string MeasurementsCollectionName => "measurements";
}
