using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Metrix.Persistence.Mongo.DocumentTypes.Metrics;
using MongoDB.Driver;

namespace Metrix.Persistence.Mongo;

public class MongoDb : IDb
{
  private readonly IMongoCollection<IMetricDocument> _metrics;
  private readonly IMongoCollection<IMeasurement> _measurements;

  public MongoDb(IDatabaseSettings settings)
  {
    IMongoClient client = new MongoClient(settings.MongoConnectionString);

    IMongoDatabase? db = client.GetDatabase(settings.DatabaseName);

    _metrics = db.GetCollection<IMetricDocument>(settings.MetricCollectionName);
    _measurements = db.GetCollection<IMeasurement>(settings.MeasurementCollectionName);
  }

  public async Task<IMetric[]> GetAllMetrics()
  {
    List<IMetricDocument> metrics = await _metrics.Find(Builders<IMetricDocument>.Filter.Empty).ToListAsync();
    return metrics.Select(MetricDocumentMapper.FromDocument<IMetric>).ToArray();
  }

  public async Task<IMetric?> GetMetric(string metricKey)
  {
    FilterDefinition<IMetricDocument> filter = Builders<IMetricDocument>.Filter.Eq(
      nameof(IMetricDocument.Key),
      metricKey
    );

    List<IMetricDocument> metrics = await _metrics.Find(filter).ToListAsync();

    IMetricDocument? document = metrics.FirstOrDefault();

    return document == null
      ? null
      : MetricDocumentMapper.FromDocument<IMetric>(document);
  }

  public async Task<IMeasurement[]> GetAllMeasurements(string metricKey)
  {
    List<IMeasurement> measurements = await _measurements.Find(Builders<IMeasurement>.Filter.Empty).ToListAsync();
    return measurements.ToArray();
  }

  public async Task AddMetric(IMetric metric)
  {
    IMetricDocument document = MetricDocumentMapper.ToDocument(metric);
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
