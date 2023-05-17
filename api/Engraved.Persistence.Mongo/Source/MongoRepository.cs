using System.Security.Authentication;
using System.Text.RegularExpressions;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Metrics;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.User;
using Engraved.Persistence.Mongo.DocumentTypes;
using Engraved.Persistence.Mongo.DocumentTypes.Measurements;
using Engraved.Persistence.Mongo.DocumentTypes.Metrics;
using Engraved.Persistence.Mongo.DocumentTypes.Users;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo;

public class MongoRepository : IRepository
{
  // protected so they can be accessed from TestRepository
  protected readonly IMongoCollection<MeasurementDocument> MeasurementsCollection;
  protected readonly IMongoCollection<MetricDocument> MetricsCollection;
  protected readonly IMongoCollection<UserDocument> UsersCollection;

  private const string RandomDocId = "63f949da880b5bf2518be721";

  static MongoRepository()
  {
    // below stuff is required for polymorphic document types to work. it would
    // somehow be nicer if this handled by every document-class itself, but that
    // doesn't work for whatever reasons.
    BsonClassMap.RegisterClassMap<CounterMeasurementDocument>();
    BsonClassMap.RegisterClassMap<TimerMeasurementDocument>();
    BsonClassMap.RegisterClassMap<GaugeMeasurementDocument>();
    BsonClassMap.RegisterClassMap<ScrapsMeasurementDocument>();
    BsonClassMap.RegisterClassMap<CounterMetricDocument>();
    BsonClassMap.RegisterClassMap<TimerMetricDocument>();
    BsonClassMap.RegisterClassMap<GaugeMetricDocument>();
    BsonClassMap.RegisterClassMap<ScrapsMetricDocument>();
  }

  public MongoRepository(IMongoRepositorySettings settings)
  {
    IMongoClient client = CreateMongoClient(settings);
    IMongoDatabase? db = client.GetDatabase(settings.DatabaseName);

    MetricsCollection = db.GetCollection<MetricDocument>(settings.MetricsCollectionName);
    MeasurementsCollection = db.GetCollection<MeasurementDocument>(settings.MeasurementsCollectionName);
    UsersCollection = db.GetCollection<UserDocument>(settings.UsersCollectionName);
  }

  public virtual async Task<IUser?> GetUser(string? name)
  {
    if (string.IsNullOrEmpty(name))
    {
      throw new ArgumentNullException(nameof(name), "Username must be specified.");
    }

    UserDocument? document = await UsersCollection
      .Find(Builders<UserDocument>.Filter.Where(d => d.Name == name))
      .FirstOrDefaultAsync();

    return UserDocumentMapper.FromDocument(document);
  }

  public virtual async Task<UpsertResult> UpsertUser(IUser user)
  {
    return await UpsertUserInternal(user);
  }

  public async Task<IUser[]> GetUsers(params string[] userIds)
  {
    if (userIds.Length == 0)
    {
      return Array.Empty<IUser>();
    }

    List<UserDocument> users = await UsersCollection
      .Find(Builders<UserDocument>.Filter.Or(userIds.Distinct().Select(MongoUtil.GetDocumentByIdFilter<UserDocument>)))
      .ToListAsync();

    return users.Select(UserDocumentMapper.FromDocument).ToArray();
  }

  public async Task<IUser[]> GetAllUsers()
  {
    List<UserDocument> users = await UsersCollection
      .Find(MongoUtil.GetAllDocumentsFilter<UserDocument>())
      .ToListAsync();

    return users.Select(UserDocumentMapper.FromDocument).ToArray();
  }

  public async Task<IMetric[]> GetAllMetrics(string? searchText = null, int? limit = null)
  {
    List<FilterDefinition<MetricDocument>> filters = new()
    {
      GetAllMetricDocumentsFilter<MetricDocument>(PermissionKind.Read)
    };

    if (!string.IsNullOrEmpty(searchText))
    {
      filters.AddRange(
        searchText.Split(" ")
          .Select(
            segment =>
              Builders<MetricDocument>.Filter.Or(
                Builders<MetricDocument>.Filter.Regex(
                  d => d.Name,
                  GetRegex(segment)
                ),
                Builders<MetricDocument>.Filter.Regex(
                  d => d.Description,
                  GetRegex(segment)
                )
              )
          )
      );
    }
    
    List<MetricDocument> metrics = await MetricsCollection
      .Find(Builders<MetricDocument>.Filter.And(filters))
      .Sort(Builders<MetricDocument>.Sort.Descending(d => d.EditedOn))
      .Limit(limit)
      .ToListAsync();

    return metrics.Select(MetricDocumentMapper.FromDocument<IMetric>).ToArray();
  }

  public async Task<IMetric?> GetMetric(string metricId)
  {
    return await GetMetric(metricId, PermissionKind.Read);
  }

  public async Task<IMeasurement[]> GetAllMeasurements(
      string metricId,
      DateTime? fromDate,
      DateTime? toDate,
      IDictionary<string, string[]>? attributeValues
    )
  {
    IMetric? metric = await GetMetric(metricId);
    if (metric == null)
    {
      return Array.Empty<IMeasurement>();
    }

    var filters = new List<FilterDefinition<MeasurementDocument>>
    {
      Builders<MeasurementDocument>.Filter.Where(d => d.MetricId == metricId)
    };

    if (fromDate.HasValue)
    {
      filters.Add(Builders<MeasurementDocument>.Filter.Where(d => d.DateTime >= fromDate.Value));
    }

    if (toDate.HasValue)
    {
      filters.Add(Builders<MeasurementDocument>.Filter.Where(d => d.DateTime < toDate.Value.AddDays(1)));
    }

    if (attributeValues != null)
    {
      filters.AddRange(
        attributeValues
          .Select(
            attributeValue =>
              Builders<MeasurementDocument>.Filter.Or(
                attributeValue.Value.Select(
                  s => Builders<MeasurementDocument>.Filter.Where(
                    d => d.MetricAttributeValues[attributeValue.Key].Contains(s)
                  )
                )
              )
          )
      );
    }

    List<MeasurementDocument> measurements = await MeasurementsCollection
      .Find(Builders<MeasurementDocument>.Filter.And(filters))
      .Sort(Builders<MeasurementDocument>.Sort.Descending(d => d.DateTime))
      .ToListAsync();

    return measurements
      .Select(MeasurementDocumentMapper.FromDocument<IMeasurement>)
      .ToArray();
  }

  // attention: there's no security here for the moment. might not be required as
  // you explicitly need to specify the metric IDs.
  public async Task<IMeasurement[]> GetLastEditedMeasurements(string[] metricIds, string? searchText, int limit)
  {
    List<FilterDefinition<MeasurementDocument>> filters = new();

    FilterDefinition<MeasurementDocument> metricIdFilter =
      Builders<MeasurementDocument>.Filter.Where(d => metricIds.Contains(d.MetricId));

    filters.Add(metricIdFilter);

    if (!string.IsNullOrEmpty(searchText))
    {
      filters.AddRange(
        searchText.Split(" ")
          .Select(
            segment =>
              Builders<MeasurementDocument>.Filter.Or(
                Builders<MeasurementDocument>.Filter.Regex(
                  d => d.Notes,
                  GetRegex(segment)
                ),
                Builders<MeasurementDocument>.Filter.Regex(
                  d => ((ScrapsMeasurementDocument) d).Title,
                  GetRegex(segment)
                )
              )
          )
      );
    }

    List<MeasurementDocument> measurements = await MeasurementsCollection
      .Find(Builders<MeasurementDocument>.Filter.And(filters))
      .Sort(Builders<MeasurementDocument>.Sort.Descending(d => d.EditedOn))
      .Limit(limit)
      .ToListAsync();

    return measurements
      .Select(MeasurementDocumentMapper.FromDocument<IMeasurement>)
      .ToArray();
  }

  public virtual async Task<UpsertResult> UpsertMetric(IMetric metric)
  {
    MetricDocument document = MetricDocumentMapper.ToDocument(metric);

    ReplaceOneResult? replaceOneResult = await MetricsCollection.ReplaceOneAsync(
      MongoUtil.GetDocumentByIdFilter<MetricDocument>(metric.Id),
      document,
      new ReplaceOptions { IsUpsert = true }
    );

    return CreateUpsertResult(metric.Id, replaceOneResult);
  }

  public virtual async Task DeleteMetric(string metricId)
  {
    IMetric? metric = await GetMetric(metricId);
    if (metric == null)
    {
      return;
    }

    await MeasurementsCollection.DeleteManyAsync(
      Builders<MeasurementDocument>.Filter.Where(d => d.MetricId == metricId)
    );
    await MetricsCollection.DeleteOneAsync(MongoUtil.GetDocumentByIdFilter<MetricDocument>(metricId));
  }

  public async Task ModifyMetricPermissions(string metricId, Dictionary<string, PermissionKind> permissions)
  {
    IMetric? metric = await GetMetric(metricId);
    if (metric == null)
    {
      // should we throw here?
      return;
    }

    var permissionsEnsurer = new PermissionsEnsurer(this, UpsertUserInternal);
    await permissionsEnsurer.EnsurePermissions(metric, permissions);

    await UpsertMetric(metric);
  }

  public virtual async Task<UpsertResult> UpsertMeasurement<TMeasurement>(TMeasurement measurement)
    where TMeasurement : IMeasurement
  {
    MeasurementDocument document = MeasurementDocumentMapper.ToDocument(measurement);

    ReplaceOneResult? replaceOneResult = await MeasurementsCollection.ReplaceOneAsync(
      MongoUtil.GetDocumentByIdFilter<MeasurementDocument>(measurement.Id),
      document,
      new ReplaceOptions { IsUpsert = true }
    );

    return CreateUpsertResult(measurement.Id, replaceOneResult);
  }

  public async Task DeleteMeasurement(string measurementId)
  {
    await MeasurementsCollection.DeleteOneAsync(MongoUtil.GetDocumentByIdFilter<MeasurementDocument>(measurementId));
  }

  public async Task<IMeasurement?> GetMeasurement(string measurementId)
  {
    if (string.IsNullOrEmpty(measurementId))
    {
      throw new ArgumentNullException(nameof(measurementId), "Id must be specified.");
    }

    MeasurementDocument? document = await MeasurementsCollection
      .Find(MongoUtil.GetDocumentByIdFilter<MeasurementDocument>(measurementId))
      .FirstOrDefaultAsync();

    return MeasurementDocumentMapper.FromDocument<IMeasurement>(document);
  }

  public async Task WakeMeUp()
  {
    await UsersCollection.FindAsync(MongoUtil.GetDocumentByIdFilter<UserDocument>(RandomDocId));
  }

  private async Task<UpsertResult> UpsertUserInternal(IUser user)
  {
    UserDocument document = UserDocumentMapper.ToDocument(user);

    IUser? existingUser = await GetUser(user.Name);
    if (existingUser != null && string.IsNullOrEmpty(user.Id))
    {
      throw new ArgumentException("ID must be specified for existing users.");
    }

    ReplaceOneResult? replaceOneResult = await UsersCollection.ReplaceOneAsync(
      Builders<UserDocument>.Filter.Where(d => d.Name == user.Name),
      document,
      new ReplaceOptions { IsUpsert = true }
    );

    return CreateUpsertResult(user.Id, replaceOneResult);
  }

  protected async Task<IMetric?> GetMetric(string metricId, PermissionKind permissionKind)
  {
    if (string.IsNullOrEmpty(metricId))
    {
      throw new ArgumentNullException(nameof(metricId), "Id must be specified.");
    }

    MetricDocument? document = await MetricsCollection
      .Find(GetMetricDocumentByIdFilter<MetricDocument>(metricId, permissionKind))
      .FirstOrDefaultAsync();

    return MetricDocumentMapper.FromDocument<IMetric>(document);
  }

  private FilterDefinition<TDocument> GetMetricDocumentByIdFilter<TDocument>(string metricId, PermissionKind kind)
    where TDocument : IDocument
  {
    return Builders<TDocument>.Filter.And(
      GetAllMetricDocumentsFilter<TDocument>(kind),
      MongoUtil.GetDocumentByIdFilter<TDocument>(metricId)
    );
  }

  protected virtual FilterDefinition<TDocument> GetAllMetricDocumentsFilter<TDocument>(PermissionKind kind)
    where TDocument : IDocument
  {
    return MongoUtil.GetAllDocumentsFilter<TDocument>();
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

  private static BsonRegularExpression GetRegex(string searchText)
  {
    return new BsonRegularExpression(new Regex(searchText, RegexOptions.IgnoreCase | RegexOptions.Multiline));
  }

  private static IMongoClient CreateMongoClient(IMongoRepositorySettings settings)
  {
    MongoClientSettings? clientSettings = MongoClientSettings.FromUrl(new MongoUrl(settings.MongoDbConnectionString));
    clientSettings.SslSettings = new SslSettings { EnabledSslProtocols = SslProtocols.Tls12 };

    return new MongoClient(clientSettings);
  }
}
