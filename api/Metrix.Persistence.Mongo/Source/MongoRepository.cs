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
  private readonly IMongoCollection<IMetricDocument> _metrics;
  private readonly IMongoCollection<IMeasurementDocument> _measurements;

  public MongoRepository(IMongoRepositorySettings settings)
  {
    IMongoClient client = new MongoClient(settings.MongoDbConnectionString);
    IMongoDatabase? db = client.GetDatabase(settings.DatabaseName);

    _metrics = db.GetCollection<IMetricDocument>(settings.MetricsCollectionName);
    _measurements = db.GetCollection<IMeasurementDocument>(settings.MeasurementsCollectionName);
  }

  public async Task<IMetric[]> GetAllMetrics()
  {
    List<IMetricDocument> metrics = await _metrics.Find(Builders<IMetricDocument>.Filter.Empty).ToListAsync();
    return metrics.Select(MetricDocumentMapper.FromDocument<IMetric>).ToArray();
  }

  public async Task<IMetric?> GetMetric(string metricKey)
  {
    List<IMetricDocument> metrics = await _metrics.Find(GetFilterByKey(metricKey)).ToListAsync();

    IMetricDocument? document = metrics.FirstOrDefault();

    return document == null
      ? null
      : MetricDocumentMapper.FromDocument<IMetric>(document);
  }

  public async Task<IMeasurement[]> GetAllMeasurements(string metricKey)
  {
    List<IMeasurementDocument> measurements = await _measurements
      .Find(Builders<IMeasurementDocument>.Filter.Eq(nameof(IMeasurementDocument.MetricKey), metricKey))
      .ToListAsync();

    return measurements
      .Select(MeasurementDocumentMapper.FromDocument<IMeasurement>)
      .ToArray();
  }

  public async Task AddMetric(IMetric metric)
  {
    IMetricDocument document = MetricDocumentMapper.ToDocument(metric);

    // this should not really be required... why is it!?
    document.Id = ObjectId.GenerateNewId();

    await _metrics.InsertOneAsync(document);
  }

  public async Task UpdateMetric(IMetric metric)
  {
    UpdateDefinition<IMetricDocument>? update = Builders<IMetricDocument>.Update
      .Set(nameof(IMetricDocument.Name), metric.Name)
      .Set(nameof(IMetricDocument.Description), metric.Description);

    await _metrics.FindOneAndUpdateAsync(GetFilterByKey(metric.Key), update);
  }

  public async Task AddMeasurement<TMeasurement>(TMeasurement measurement) where TMeasurement : IMeasurement
  {
    IMeasurementDocument document = MeasurementDocumentMapper.ToDocument(measurement);

    // this should not really be required... why is it!?
    document.Id = ObjectId.GenerateNewId();

    await _measurements.InsertOneAsync(document);
  }

  private static FilterDefinition<IMetricDocument> GetFilterByKey(string metricKey)
  {
    return Builders<IMetricDocument>.Filter.Eq(nameof(IMetricDocument.Key), metricKey);
  }
}
