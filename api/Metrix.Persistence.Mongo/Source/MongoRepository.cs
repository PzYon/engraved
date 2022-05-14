using System.Security.Authentication;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Metrix.Core.Domain.User;
using Metrix.Persistence.Mongo.DocumentTypes.Measurements;
using Metrix.Persistence.Mongo.DocumentTypes.Metrics;
using Metrix.Persistence.Mongo.DocumentTypes.Users;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Metrix.Persistence.Mongo;

public class MongoRepository : IRepository
{
  private readonly IMongoCollection<MeasurementDocument> _measurements;
  private readonly IMongoCollection<MetricDocument> _metrics;
  private readonly IMongoCollection<UserDocument> _users;

  public MongoRepository(IMongoRepositorySettings settings)
  {
    IMongoClient client = CreateMongoClient(settings);
    IMongoDatabase? db = client.GetDatabase(settings.DatabaseName);

    _metrics = db.GetCollection<MetricDocument>(settings.MetricsCollectionName);
    _measurements = db.GetCollection<MeasurementDocument>(settings.MeasurementsCollectionName);
    _users = db.GetCollection<UserDocument>(settings.UsersCollectionName);
  }

  public async Task<IUser?> GetUser(string name)
  {
    if (string.IsNullOrEmpty(name))
    {
      throw new ArgumentNullException(nameof(name), "Username must be specified.");
    }

    UserDocument? document = await _users
      .Find(Builders<UserDocument>.Filter.Eq(nameof(UserDocument.Id), name))
      .FirstOrDefaultAsync();

    return document == null
      ? null
      : UserDocumentMapper.FromDocument(document);
  }

  public async Task<UpsertResult> UpsertUser(IUser user)
  {
    UserDocument document = UserDocumentMapper.ToDocument(user);

    ReplaceOneResult replaceOneResult = await _users.ReplaceOneAsync(
      Builders<UserDocument>.Filter.Eq(
        nameof(UserDocument.Id),
        string.IsNullOrEmpty(user.Id) ? ObjectId.GenerateNewId() : ParseObjectId(user.Id)
      ),
      document,
      new ReplaceOptions { IsUpsert = true }
    );

    string id = (string.IsNullOrEmpty(user.Id) ? replaceOneResult.UpsertedId.ToString() : user.Id)!;
    return new UpsertResult { EntityId = id };
  }

  public async Task<IMetric[]> GetAllMetrics()
  {
    List<MetricDocument> metrics = await _metrics.Find(Builders<MetricDocument>.Filter.Empty).ToListAsync();
    return metrics.Select(MetricDocumentMapper.FromDocument<IMetric>).ToArray();
  }

  public async Task<IMetric?> GetMetric(string metricId)
  {
    if (string.IsNullOrEmpty(metricId))
    {
      throw new ArgumentNullException(nameof(metricId), "Id must be specified.");
    }

    MetricDocument? document = await _metrics.Find(GetMetricFilterById(metricId)).FirstOrDefaultAsync();

    return document == null
      ? null
      : MetricDocumentMapper.FromDocument<IMetric>(document);
  }

  public async Task<IMeasurement[]> GetAllMeasurements(string metricId)
  {
    List<MeasurementDocument> measurements = await _measurements
      .Find(Builders<MeasurementDocument>.Filter.Eq(nameof(MeasurementDocument.MetricId), new ObjectId(metricId)))
      .ToListAsync();

    return measurements
      .Select(MeasurementDocumentMapper.FromDocument<IMeasurement>)
      .ToArray();
  }

  public async Task<UpsertResult> UpsertMetric(IMetric metric)
  {
    MetricDocument document = MetricDocumentMapper.ToDocument(metric);

    ReplaceOneResult replaceOneResult = await _metrics.ReplaceOneAsync(
      GetMetricFilterById(metric.Id),
      document,
      new ReplaceOptions { IsUpsert = true }
    );

    string id = (string.IsNullOrEmpty(metric.Id) ? replaceOneResult.UpsertedId.ToString() : metric.Id)!;
    return new UpsertResult { EntityId = id };
  }

  public async Task<UpsertResult> UpsertMeasurement<TMeasurement>(TMeasurement measurement)
    where TMeasurement : IMeasurement
  {
    MeasurementDocument document = MeasurementDocumentMapper.ToDocument(measurement);

    ReplaceOneResult replaceOneResult = await _measurements.ReplaceOneAsync(
      GetMeasurementFilterById(measurement.Id),
      document,
      new ReplaceOptions { IsUpsert = true }
    );

    string id = (string.IsNullOrEmpty(measurement.Id) ? replaceOneResult.UpsertedId.ToString() : measurement.Id)!;
    return new UpsertResult { EntityId = id };
  }

  private static FilterDefinition<MetricDocument> GetMetricFilterById(string? metricId)
  {
    return Builders<MetricDocument>.Filter.Eq(
      nameof(MetricDocument.Id),
      string.IsNullOrEmpty(metricId) ? ObjectId.GenerateNewId() : ParseObjectId(metricId)
    );
  }

  private static FilterDefinition<MeasurementDocument> GetMeasurementFilterById(string? measurementId)
  {
    return Builders<MeasurementDocument>.Filter.Eq(
      nameof(MeasurementDocument.Id),
      string.IsNullOrEmpty(measurementId) ? ObjectId.GenerateNewId() : ParseObjectId(measurementId)
    );
  }

  private static ObjectId ParseObjectId(string entityId)
  {
    if (ObjectId.TryParse(entityId, out ObjectId objectId))
    {
      return objectId;
    }

    throw new ArgumentOutOfRangeException(nameof(entityId), $"\"{entityId}\" is not a valid ID.");
  }

  private static IMongoClient CreateMongoClient(IMongoRepositorySettings settings)
  {
    MongoClientSettings clientSettings = MongoClientSettings.FromUrl(new MongoUrl(settings.MongoDbConnectionString));
    clientSettings.SslSettings = new SslSettings { EnabledSslProtocols = SslProtocols.Tls12 };

    return new MongoClient(clientSettings);
  }
}
