using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Metrix.Persistence.Mongo.DocumentTypes;
using MongoDB.Driver;

namespace Metrix.Persistence.Mongo;

public class MongoDb : IDb
{
  private readonly IMongoCollection<BaseMetricDocument> _metrics;
  private readonly IMongoCollection<IMeasurement> _measurements;

  public MongoDb(IDatabaseSettings settings)
  {
    IMongoClient client = new MongoClient(settings.MongoConnectionString);

    IMongoDatabase? db = client.GetDatabase(settings.DatabaseName);

    _metrics = db.GetCollection<BaseMetricDocument>(settings.MetricCollectionName);
    _measurements = db.GetCollection<IMeasurement>(settings.MeasurementCollectionName);
  }

  public async Task<IMetric[]> GetAllMetrics()
  {
    List<BaseMetricDocument> metrics = await _metrics.Find(Builders<BaseMetricDocument>.Filter.Empty).ToListAsync();
    return metrics.Select(MetricDocumentMapper.FromDocument).ToArray();
  }

  public async Task<IMetric?> GetMetric(string metricKey)
  {
    FilterDefinition<BaseMetricDocument> filter = Builders<BaseMetricDocument>.Filter.Eq(m => m.Key, metricKey);
    List<BaseMetricDocument> metrics = await _metrics.Find(filter).ToListAsync();

    BaseMetricDocument? baseMetricDocument = metrics.FirstOrDefault();

    return baseMetricDocument == null
      ? null
      : MetricDocumentMapper.FromDocument(baseMetricDocument);
  }

  public async Task<IMeasurement[]> GetAllMeasurements(string metricKey)
  {
    List<IMeasurement> measurements = await _measurements.Find(Builders<IMeasurement>.Filter.Empty).ToListAsync();
    return measurements.ToArray();
  }

  public async Task AddMetric(IMetric metric)
  {
    BaseMetricDocument document = MetricDocumentMapper.ToDocument(metric);
    await _metrics.InsertOneAsync(document);
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
