using System.Security.Authentication;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Metrix.Core.Domain.User;
using Metrix.Persistence.Mongo.DocumentTypes;
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

  public virtual async Task<IUser?> GetUser(string? name)
  {
    if (string.IsNullOrEmpty(name))
    {
      throw new ArgumentNullException(nameof(name), "Username must be specified.");
    }

    UserDocument? document = await _users
      .Find(Builders<UserDocument>.Filter.Eq(nameof(UserDocument.Name), name))
      .FirstOrDefaultAsync();

    return UserDocumentMapper.FromDocument(document);
  }

  public virtual async Task<UpsertResult> UpsertUser(IUser user)
  {
    UserDocument document = UserDocumentMapper.ToDocument(user);

    ReplaceOneResult replaceOneResult = await _users.ReplaceOneAsync(
      Builders<UserDocument>.Filter.Eq(nameof(IUser.Name), EnsureObjectId(user.Name)),
      document,
      new ReplaceOptions { IsUpsert = true }
    );

    return CreateUpsertResult(user.Id, replaceOneResult);
  }

  public async Task<IMetric[]> GetAllMetrics()
  {
    List<MetricDocument> metrics = await _metrics.Find(GetAllDocumentsFilter<MetricDocument>()).ToListAsync();
    return metrics.Select(MetricDocumentMapper.FromDocument<IMetric>).ToArray();
  }

  public async Task<IMetric?> GetMetric(string metricId)
  {
    if (string.IsNullOrEmpty(metricId))
    {
      throw new ArgumentNullException(nameof(metricId), "Id must be specified.");
    }

    MetricDocument? document = await _metrics
      .Find(GetDocumentByIdFilter<MetricDocument>(metricId))
      .FirstOrDefaultAsync();

    return MetricDocumentMapper.FromDocument<IMetric>(document);
  }

  public async Task<IMeasurement[]> GetAllMeasurements(string metricId)
  {
    List<MeasurementDocument> measurements = await _measurements
      .Find(
        CreateScopedQuery(
          Builders<MeasurementDocument>.Filter.Eq(nameof(MeasurementDocument.MetricId), ObjectId.Parse(metricId))
        )
      )
      .ToListAsync();

    return measurements
      .Select(MeasurementDocumentMapper.FromDocument<IMeasurement>)
      .ToArray();
  }

  public virtual async Task<UpsertResult> UpsertMetric(IMetric metric)
  {
    MetricDocument document = MetricDocumentMapper.ToDocument(metric);

    ReplaceOneResult replaceOneResult = await _metrics.ReplaceOneAsync(
      GetDocumentByIdFilter<MetricDocument>(metric.Id),
      document,
      new ReplaceOptions { IsUpsert = true }
    );

    return CreateUpsertResult(metric.Id, replaceOneResult);
  }

  public virtual async Task<UpsertResult> UpsertMeasurement<TMeasurement>(TMeasurement measurement)
    where TMeasurement : IMeasurement
  {
    MeasurementDocument document = MeasurementDocumentMapper.ToDocument(measurement);

    ReplaceOneResult replaceOneResult = await _measurements.ReplaceOneAsync(
      GetDocumentByIdFilter<MeasurementDocument>(measurement.Id),
      document,
      new ReplaceOptions { IsUpsert = true }
    );

    return CreateUpsertResult(measurement.Id, replaceOneResult);
  }

  protected virtual FilterDefinition<TDocument> GetAllDocumentsFilter<TDocument>()
    where TDocument : IUserScopedDocument
  {
    return Builders<TDocument>.Filter.Empty;
  }

  private FilterDefinition<TDocument> CreateScopedQuery<TDocument>(FilterDefinition<TDocument> query)
    where TDocument : IUserScopedDocument
  {
    return Builders<TDocument>.Filter.And(GetAllDocumentsFilter<TDocument>(), query);
  }

  private FilterDefinition<TDocument> GetDocumentByIdFilter<TDocument>(string? documentId)
    where TDocument : IUserScopedDocument
  {
    return CreateScopedQuery(
      Builders<TDocument>.Filter.Eq(nameof(IDocument.Id), EnsureObjectId(documentId))
    );
  }

  private static UpsertResult CreateUpsertResult(string? entityId, ReplaceOneResult replaceOneResult)
  {
    string id = (string.IsNullOrEmpty(entityId)
      ? replaceOneResult.UpsertedId.ToString()
      : entityId)!;

    return new UpsertResult
    {
      EntityId = id
    };
  }

  private ObjectId EnsureObjectId(string? id)
  {
    return string.IsNullOrEmpty(id)
      ? ObjectId.GenerateNewId()
      : ParseObjectId(id);
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
