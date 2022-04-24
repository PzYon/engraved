namespace Metrix.Persistence.Mongo;

public interface IDatabaseSettings
{
  string MongoConnectionString { get; }
  string DatabaseName { get; }
  string MetricsCollectionName { get; }
  string MeasurementsCollectionName { get; }
}
