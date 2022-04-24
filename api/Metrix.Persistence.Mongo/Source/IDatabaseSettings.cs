namespace Metrix.Persistence.Mongo;

public interface IDatabaseSettings
{
  string MongoConnectionString { get; }
  string DatabaseName { get; }
  string MetricCollectionName { get; }
  string MeasurementCollectionName { get; }
}
