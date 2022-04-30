using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Metrix.Persistence.Mongo.DocumentTypes.Measurements;
using Metrix.Persistence.Mongo.DocumentTypes.Metrics;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Metrix.Persistence.Mongo;

public class MongoRepository : IRepository
{
  private readonly IMongoCollection<MetricDocument> _metrics;
  private readonly IMongoCollection<MeasurementDocument> _measurements;

  public MongoRepository(IMongoRepositorySettings settings)
  {
    IMongoClient client = new MongoClient(settings.MongoDbConnectionString);
    IMongoDatabase? db = client.GetDatabase(settings.DatabaseName);

    _metrics = db.GetCollection<MetricDocument>(settings.MetricsCollectionName);
    _measurements = db.GetCollection<MeasurementDocument>(settings.MeasurementsCollectionName);
  }

  public async Task<IMetric[]> GetAllMetrics()
  {
    List<MetricDocument> metrics = await _metrics.Find(Builders<MetricDocument>.Filter.Empty).ToListAsync();
    return metrics.Select(MetricDocumentMapper.FromDocument<IMetric>).ToArray();
  }

  public async Task<IMetric?> GetMetric(string metricKey)
  {
    List<MetricDocument> metrics = await _metrics.Find(GetMetricFilterByKey(metricKey)).ToListAsync();

    MetricDocument? document = metrics.FirstOrDefault();

    return document == null
      ? null
      : MetricDocumentMapper.FromDocument<IMetric>(document);
  }

  public async Task<IMeasurement[]> GetAllMeasurements(string metricKey)
  {
    List<MeasurementDocument> measurements = await _measurements
      .Find(GetMeasurementFilterByKey(metricKey))
      .ToListAsync();

    return measurements
      .Select(MeasurementDocumentMapper.FromDocument<IMeasurement>)
      .ToArray();
  }

  public async Task AddMetric(IMetric metric)
  {
    MetricDocument document = MetricDocumentMapper.ToDocument(metric);

    // this should not really be required... why is it!?
    document.Id = ObjectId.GenerateNewId();

    await _metrics.InsertOneAsync(document);
  }

  public async Task UpdateMetric(IMetric metric)
  {
    await _metrics.ReplaceOneAsync(
      GetMetricFilterByKey(metric.Key),
      MetricDocumentMapper.ToDocument(metric),
      new ReplaceOptions { IsUpsert = true }
    );
  }

  public async Task UpsertMeasurement<TMeasurement>(TMeasurement measurement) where TMeasurement : IMeasurement
  {
    MeasurementDocument document = MeasurementDocumentMapper.ToDocument(measurement);

    // this should not really be required... why is it!?
    if (document.Id == null)
    {
      document.Id = ObjectId.GenerateNewId();
    }

    await _measurements.ReplaceOneAsync(
      Builders<MeasurementDocument>.Filter.Eq(nameof(MeasurementDocument.Id), document.Id),
      document,
      new ReplaceOptions { IsUpsert = true }
    );
  }

  private static FilterDefinition<MetricDocument> GetMetricFilterByKey(string metricKey)
  {
    return Builders<MetricDocument>.Filter.Eq(nameof(MetricDocument.Key), metricKey);
  }

  private static FilterDefinition<MeasurementDocument> GetMeasurementFilterByKey(string metricKey)
  {
    return Builders<MeasurementDocument>.Filter.Eq(nameof(MeasurementDocument.MetricKey), metricKey);
  }
}
