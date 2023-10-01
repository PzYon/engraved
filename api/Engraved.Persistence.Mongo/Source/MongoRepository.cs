using System.Linq.Expressions;
using System.Security.Authentication;
using System.Text.RegularExpressions;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;
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
  protected readonly IMongoCollection<JournalDocument> JournalsCollection;
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
    BsonClassMap.RegisterClassMap<CounterJournalDocument>();
    BsonClassMap.RegisterClassMap<TimerJournalDocument>();
    BsonClassMap.RegisterClassMap<GaugeJournalDocument>();
    BsonClassMap.RegisterClassMap<ScrapsJournalDocument>();
  }

  public MongoRepository(IMongoRepositorySettings settings)
  {
    IMongoClient client = CreateMongoClient(settings);
    IMongoDatabase? db = client.GetDatabase(settings.DatabaseName);

    JournalsCollection = db.GetCollection<JournalDocument>(settings.JournalsCollectionName);
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

  public async Task<IJournal[]> GetAllJournals(
    string? searchText = null,
    JournalType[]? journalTypes = null,
    int? limit = null
  )
  {
    List<FilterDefinition<JournalDocument>> filters = GetFreeTextFilters<JournalDocument>(
      searchText,
      d => d.Name!,
      d => d.Description!
    );

    filters.Add(GetAllMetricDocumentsFilter<JournalDocument>(PermissionKind.Read));

    if (journalTypes is { Length: > 0 })
    {
      filters.Add(
        Builders<JournalDocument>.Filter.Or(
          journalTypes.Select(t => Builders<JournalDocument>.Filter.Where(GetIsMetricTypeExpression(t)))
        )
      );
    }

    List<JournalDocument> metrics = await JournalsCollection
      .Find(Builders<JournalDocument>.Filter.And(filters))
      .Sort(Builders<JournalDocument>.Sort.Descending(d => d.EditedOn))
      .Limit(limit)
      .ToListAsync();

    return metrics.Select(JournalDocumentMapper.FromDocument<IJournal>).ToArray();
  }

  // there must be a better solution than this, but it works for the moment... i believe
  // Builders<MetricDocument>.Filter.Where(t => t.Type == metricType) does not work because
  // MetricDocument.Type is an ABSTRACT property.
  private static Expression<Func<JournalDocument, bool>> GetIsMetricTypeExpression(JournalType journalType)
  {
    switch (journalType)
    {
      case JournalType.Counter:
        return d => d is CounterJournalDocument;
      case JournalType.Gauge:
        return d => d is GaugeJournalDocument;
      case JournalType.Timer:
        return d => d is TimerJournalDocument;
      case JournalType.Scraps:
        return d => d is ScrapsJournalDocument;
      default:
        throw new ArgumentOutOfRangeException(
          nameof(journalType),
          journalType,
          $"{nameof(GetIsMetricTypeExpression)} not defined for {journalType}."
        );
    }
  }

  private static Expression<Func<MeasurementDocument, bool>> GetIsMeasurementTypeExpression(JournalType journalType)
  {
    switch (journalType)
    {
      case JournalType.Counter:
        return d => d is CounterMeasurementDocument;
      case JournalType.Gauge:
        return d => d is GaugeMeasurementDocument;
      case JournalType.Timer:
        return d => d is TimerMeasurementDocument;
      case JournalType.Scraps:
        return d => d is ScrapsMeasurementDocument;
      default:
        throw new ArgumentOutOfRangeException(
          nameof(journalType),
          journalType,
          $"{nameof(GetIsMeasurementTypeExpression)} not defined for {journalType}."
        );
    }
  }

  public async Task<IJournal?> GetJournal(string journalId)
  {
    return await GetMetric(journalId, PermissionKind.Read);
  }

  public async Task<IMeasurement[]> GetAllMeasurements(
    string journalId,
    DateTime? fromDate,
    DateTime? toDate,
    IDictionary<string, string[]>? attributeValues
  )
  {
    IJournal? metric = await GetJournal(journalId);
    if (metric == null)
    {
      return Array.Empty<IMeasurement>();
    }

    var filters = new List<FilterDefinition<MeasurementDocument>>
    {
      Builders<MeasurementDocument>.Filter.Where(d => d.ParentId == journalId)
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
                    d => d.JournalAttributeValues[attributeValue.Key].Contains(s)
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
  public async Task<IMeasurement[]> GetLastEditedMeasurements(
    string[]? journalIds,
    string? searchText,
    JournalType[]? metricTypes,
    int limit
  )
  {
    List<FilterDefinition<MeasurementDocument>> filters = GetFreeTextFilters<MeasurementDocument>(
      searchText,
      d => d.Notes!,
      d => ((ScrapsMeasurementDocument)d).Title!
    );

    if (journalIds is { Length: > 0 })
    {
      filters.Add(Builders<MeasurementDocument>.Filter.Where(d => journalIds.Contains(d.ParentId)));
    }

    if (metricTypes is { Length: > 0 })
    {
      filters.Add(
        Builders<MeasurementDocument>.Filter.Or(
          metricTypes.Select(t => Builders<MeasurementDocument>.Filter.Where(GetIsMeasurementTypeExpression(t)))
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

  public virtual async Task<UpsertResult> UpsertJournal(IJournal journal)
  {
    JournalDocument document = JournalDocumentMapper.ToDocument(journal);

    ReplaceOneResult? replaceOneResult = await JournalsCollection.ReplaceOneAsync(
      MongoUtil.GetDocumentByIdFilter<JournalDocument>(journal.Id),
      document,
      new ReplaceOptions { IsUpsert = true }
    );

    return CreateUpsertResult(journal.Id, replaceOneResult);
  }

  public virtual async Task DeleteJournal(string journalId)
  {
    IJournal? metric = await GetJournal(journalId);
    if (metric == null)
    {
      return;
    }

    await MeasurementsCollection.DeleteManyAsync(
      Builders<MeasurementDocument>.Filter.Where(d => d.ParentId == journalId)
    );

    await JournalsCollection.DeleteOneAsync(
      MongoUtil.GetDocumentByIdFilter<JournalDocument>(journalId)
    );
  }

  public async Task ModifyJournalPermissions(string metricId, Dictionary<string, PermissionKind> permissions)
  {
    IJournal? metric = await GetJournal(metricId);
    if (metric == null)
    {
      // should we throw here?
      return;
    }

    var permissionsEnsurer = new PermissionsEnsurer(this, UpsertUserInternal);
    await permissionsEnsurer.EnsurePermissions(metric, permissions);

    await UpsertJournal(metric);
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

  protected async Task<IJournal?> GetMetric(string metricId, PermissionKind permissionKind)
  {
    if (string.IsNullOrEmpty(metricId))
    {
      throw new ArgumentNullException(nameof(metricId), "Id must be specified.");
    }

    JournalDocument? document = await JournalsCollection
      .Find(GetMetricDocumentByIdFilter<JournalDocument>(metricId, permissionKind))
      .FirstOrDefaultAsync();

    return JournalDocumentMapper.FromDocument<IJournal>(document);
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

  private static List<FilterDefinition<T>> GetFreeTextFilters<T>(
    string? searchText,
    params Expression<Func<T, object>>[] fieldNameExpressions
  ) where T : IDocument
  {
    if (string.IsNullOrEmpty(searchText))
    {
      return new List<FilterDefinition<T>>();
    }

    return searchText.Split(" ")
      .Select(
        segment =>
        {
          return Builders<T>.Filter.Or(
            fieldNameExpressions.Select(
              exp => Builders<T>.Filter.Regex(
                exp,
                new BsonRegularExpression(new Regex(segment, RegexOptions.IgnoreCase | RegexOptions.Multiline))
              )
            )
          );
        }
      )
      .ToList();
  }

  private static IMongoClient CreateMongoClient(IMongoRepositorySettings settings)
  {
    MongoClientSettings? clientSettings = MongoClientSettings.FromUrl(new MongoUrl(settings.MongoDbConnectionString));
    clientSettings.SslSettings = new SslSettings { EnabledSslProtocols = SslProtocols.Tls12 };

    return new MongoClient(clientSettings);
  }
}
