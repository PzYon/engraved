using Metrix.Persistence.Mongo;

namespace Metrix.Api;

public class MongoRepositorySettings : IMongoRepositorySettings
{
  public string MongoDbConnectionString { get; }

  public string DatabaseName => "metrix_test";
  public string MetricsCollectionName => "metrics";
  public string MeasurementsCollectionName => "measurements";

  public MongoRepositorySettings(string connectionString)
  {
    MongoDbConnectionString = connectionString;
  }
}
