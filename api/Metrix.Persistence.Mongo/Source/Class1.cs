using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using MongoDB.Driver;

namespace Metrix.Persistence.Mongo;

public interface IDatabaseSettings
{
  string MongoConnectionString { get; }
  string DatabaseName { get; }
  string MetricCollectionName { get; }
}

public class DbService : IDb
{
  private readonly IMongoCollection<IMetric> _metrics;

  public DbService(IDatabaseSettings settings)
  {
    var client = new MongoClient(settings.MongoConnectionString);

    IMongoDatabase? db = client.GetDatabase(settings.DatabaseName);
    _metrics = db.GetCollection<IMetric>(settings.MetricCollectionName);
  }

  public async Task<IMetric[]> GetAllMetrics()
  {
    IAsyncCursor<IMetric> asyncCursor = await _metrics.FindAsync(FilterDefinition<IMetric>.Empty);
    return asyncCursor.Current.ToArray();
  }

  public async Task<IMetric?> GetMetric(string metricKey)
  {
    IAsyncCursor<IMetric> asyncCursor = await _metrics.FindAsync(metric => metric.Key == metricKey);
    return asyncCursor.Current.FirstOrDefault();
  }

  public Task<IMeasurement[]> GetAllMeasurements(string metricKey)
  {
    throw new NotImplementedException();
  }

  public Task AddMetric(IMetric metric)
  {
    throw new NotImplementedException();
  }

  public Task UpdateMetric(IMetric metric)
  {
    throw new NotImplementedException();
  }

  public Task AddMeasurement<TMeasurement>(TMeasurement measurement) where TMeasurement : IMeasurement
  {
    throw new NotImplementedException();
  }
}
