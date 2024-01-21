using System.Linq.Expressions;
using System.Security.Authentication;
using System.Text.RegularExpressions;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.User;
using Engraved.Persistence.Mongo.DocumentTypes;
using Engraved.Persistence.Mongo.DocumentTypes.Entries;
using Engraved.Persistence.Mongo.DocumentTypes.Journals;
using Engraved.Persistence.Mongo.DocumentTypes.Users;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo;

public class MongoRepository : IBaseRepository
{
  // protected so they can be accessed from TestRepository
  protected readonly IMongoCollection<EntryDocument> EntriesCollection;
  protected readonly IMongoCollection<JournalDocument> JournalsCollection;
  protected readonly IMongoCollection<UserDocument> UsersCollection;

  private const string RandomDocId = "63f949da880b5bf2518be721";

  static MongoRepository()
  {
    // below stuff is required for polymorphic document types to work. it would
    // somehow be nicer if this handled by every document-class itself, but that
    // doesn't work for whatever reasons.
    BsonClassMap.RegisterClassMap<CounterEntryDocument>();
    BsonClassMap.RegisterClassMap<TimerEntryDocument>();
    BsonClassMap.RegisterClassMap<GaugeEntryDocument>();
    BsonClassMap.RegisterClassMap<ScrapsEntryDocument>();
    BsonClassMap.RegisterClassMap<CounterJournalDocument>();
    BsonClassMap.RegisterClassMap<TimerJournalDocument>();
    BsonClassMap.RegisterClassMap<GaugeJournalDocument>();
    BsonClassMap.RegisterClassMap<ScrapsJournalDocument>();
  }

  public MongoRepository(IMongoRepositorySettings settings, string? dbNameOverride)
  {
    IMongoClient client = CreateMongoClient(settings);

    string dbName = string.IsNullOrEmpty(dbNameOverride) ? settings.DatabaseName : dbNameOverride;

    IMongoDatabase? db = client.GetDatabase(dbName);

    JournalsCollection = db.GetCollection<JournalDocument>(settings.JournalsCollectionName);
    EntriesCollection = db.GetCollection<EntryDocument>(settings.EntriesCollectionName);
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
    string[]? journalIds = null,
    int? limit = null,
    bool scheduledOnly = false
  )
  {
    List<FilterDefinition<JournalDocument>> filters = GetFreeTextFilters<JournalDocument>(
      searchText,
      d => d.Name!,
      d => d.Description!
    );

    filters.Add(GetAllJournalDocumentsFilter<JournalDocument>(PermissionKind.Read));

    if (journalTypes is { Length: > 0 })
    {
      filters.Add(
        Builders<JournalDocument>.Filter.Or(
          journalTypes.Select(t => Builders<JournalDocument>.Filter.Where(GetIsJournalTypeExpression(t)))
        )
      );
    }

    if (journalIds is { Length: > 0 })
    {
      filters.Add(
        Builders<JournalDocument>.Filter.Or(
          journalIds.Select(
            i => GetJournalDocumentByIdFilter<JournalDocument>(i, PermissionKind.Read)
          )
        )
      );
    }

    if (scheduledOnly)
    {
      filters.Add(
        Builders<JournalDocument>.Filter.Where(d => d.Schedule != null && d.Schedule.NextOccurrence != null)
      );
    }

    List<JournalDocument> journals = await JournalsCollection
      .Find(Builders<JournalDocument>.Filter.And(filters))
      .Sort(Builders<JournalDocument>.Sort.Descending(d => d.EditedOn))
      .Limit(limit)
      .ToListAsync();

    return journals.Select(JournalDocumentMapper.FromDocument<IJournal>).ToArray();
  }

  // there must be a better solution than this, but it works for the moment... i believe
  // Builders<JournalDocument>.Filter.Where(t => t.Type == journalType) does not work because
  // JournalDocument.Type is an ABSTRACT property.
  private static Expression<Func<JournalDocument, bool>> GetIsJournalTypeExpression(JournalType journalType)
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
          $"{nameof(GetIsJournalTypeExpression)} not defined for {journalType}."
        );
    }
  }

  private static Expression<Func<EntryDocument, bool>> GetIsEntryTypeExpression(JournalType journalType)
  {
    switch (journalType)
    {
      case JournalType.Counter:
        return d => d is CounterEntryDocument;
      case JournalType.Gauge:
        return d => d is GaugeEntryDocument;
      case JournalType.Timer:
        return d => d is TimerEntryDocument;
      case JournalType.Scraps:
        return d => d is ScrapsEntryDocument;
      default:
        throw new ArgumentOutOfRangeException(
          nameof(journalType),
          journalType,
          $"{nameof(GetIsEntryTypeExpression)} not defined for {journalType}."
        );
    }
  }

  public async Task<IJournal?> GetJournal(string journalId)
  {
    return await GetJournal(journalId, PermissionKind.Read);
  }

  public async Task<IEntry[]> GetAllEntries(
    string journalId,
    DateTime? fromDate,
    DateTime? toDate,
    IDictionary<string, string[]>? attributeValues
  )
  {
    IJournal? journal = await GetJournal(journalId);
    if (journal == null)
    {
      return Array.Empty<IEntry>();
    }

    var filters = new List<FilterDefinition<EntryDocument>>
    {
      Builders<EntryDocument>.Filter.Where(d => d.ParentId == journalId)
    };

    if (fromDate.HasValue)
    {
      filters.Add(Builders<EntryDocument>.Filter.Where(d => d.DateTime >= fromDate.Value));
    }

    if (toDate.HasValue)
    {
      filters.Add(Builders<EntryDocument>.Filter.Where(d => d.DateTime < toDate.Value.AddDays(1)));
    }

    if (attributeValues != null)
    {
      filters.AddRange(
        attributeValues
          .Select(
            attributeValue =>
              Builders<EntryDocument>.Filter.Or(
                attributeValue.Value.Select(
                  s => Builders<EntryDocument>.Filter.Where(
                    d => d.JournalAttributeValues[attributeValue.Key].Contains(s)
                  )
                )
              )
          )
      );
    }

    List<EntryDocument> entries = await EntriesCollection
      .Find(Builders<EntryDocument>.Filter.And(filters))
      .Sort(Builders<EntryDocument>.Sort.Descending(d => d.DateTime))
      .ToListAsync();

    return entries
      .Select(EntryDocumentMapper.FromDocument<IEntry>)
      .ToArray();
  }

  // attention: there's no security here for the moment. might not be required as
  // you explicitly need to specify the journal IDs.
  public async Task<IEntry[]> GetLastEditedEntries(
    string[]? journalIds,
    string? searchText,
    JournalType[]? journalTypes,
    int? limit,
    bool scheduledOnly = false
  )
  {
    List<FilterDefinition<EntryDocument>> filters = GetFreeTextFilters<EntryDocument>(
      searchText,
      d => d.Notes!,
      d => ((ScrapsEntryDocument) d).Title!
    );

    if (journalIds is { Length: > 0 })
    {
      filters.Add(Builders<EntryDocument>.Filter.Where(d => journalIds.Contains(d.ParentId)));
    }

    if (journalTypes is { Length: > 0 })
    {
      filters.Add(
        Builders<EntryDocument>.Filter.Or(
          journalTypes.Select(t => Builders<EntryDocument>.Filter.Where(GetIsEntryTypeExpression(t)))
        )
      );
    }

    if (scheduledOnly)
    {
      filters.Add(
        Builders<EntryDocument>.Filter.Where(d => d.Schedule != null && d.Schedule.NextOccurrence != null)
      );
    }

    List<EntryDocument> entries = await EntriesCollection
      .Find(Builders<EntryDocument>.Filter.And(filters))
      .Sort(Builders<EntryDocument>.Sort.Descending(d => d.EditedOn))
      .Limit(limit)
      .ToListAsync();

    return entries
      .Select(EntryDocumentMapper.FromDocument<IEntry>)
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
    IJournal? journal = await GetJournal(journalId);
    if (journal == null)
    {
      return;
    }

    await EntriesCollection.DeleteManyAsync(
      Builders<EntryDocument>.Filter.Where(d => d.ParentId == journalId)
    );

    await JournalsCollection.DeleteOneAsync(
      MongoUtil.GetDocumentByIdFilter<JournalDocument>(journalId)
    );
  }

  public async Task ModifyJournalPermissions(string journalId, Dictionary<string, PermissionKind> permissions)
  {
    IJournal? journal = await GetJournal(journalId);
    if (journal == null)
    {
      // should we throw here?
      return;
    }

    var permissionsEnsurer = new PermissionsEnsurer(this, UpsertUserInternal);
    await permissionsEnsurer.EnsurePermissions(journal, permissions);

    await UpsertJournal(journal);
  }

  public virtual async Task<UpsertResult> UpsertEntry<TEntry>(TEntry entry)
    where TEntry : IEntry
  {
    EntryDocument document = EntryDocumentMapper.ToDocument(entry);

    ReplaceOneResult? replaceOneResult = await EntriesCollection.ReplaceOneAsync(
      MongoUtil.GetDocumentByIdFilter<EntryDocument>(entry.Id),
      document,
      new ReplaceOptions { IsUpsert = true }
    );

    return CreateUpsertResult(entry.Id, replaceOneResult);
  }

  public async Task DeleteEntry(string entryId)
  {
    await EntriesCollection.DeleteOneAsync(MongoUtil.GetDocumentByIdFilter<EntryDocument>(entryId));
  }

  public async Task<IEntry?> GetEntry(string entryId)
  {
    if (string.IsNullOrEmpty(entryId))
    {
      throw new ArgumentNullException(nameof(entryId), "Id must be specified.");
    }

    EntryDocument? document = await EntriesCollection
      .Find(MongoUtil.GetDocumentByIdFilter<EntryDocument>(entryId))
      .FirstOrDefaultAsync();

    return EntryDocumentMapper.FromDocument<IEntry>(document);
  }

  public async Task WakeMeUp()
  {
    await UsersCollection.FindAsync(MongoUtil.GetDocumentByIdFilter<UserDocument>(RandomDocId));
  }

  public async Task<long> CountAllUsers()
  {
    return await UsersCollection.CountDocumentsAsync(
      Builders<UserDocument>.Filter.Empty,
      new CountOptions { Hint = "_id_" }
    );
  }

  public async Task<long> CountAllEntries()
  {
    return await EntriesCollection.CountDocumentsAsync(
      Builders<EntryDocument>.Filter.Empty,
      new CountOptions { Hint = "_id_" }
    );
  }

  public async Task<long> CountAllJournals()
  {
    return await JournalsCollection.CountDocumentsAsync(
      Builders<JournalDocument>.Filter.Empty,
      new CountOptions { Hint = "_id_" }
    );
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

  protected async Task<IJournal?> GetJournal(string journalId, PermissionKind permissionKind)
  {
    if (string.IsNullOrEmpty(journalId))
    {
      throw new ArgumentNullException(nameof(journalId), "Id must be specified.");
    }

    JournalDocument? document = await JournalsCollection
      .Find(GetJournalDocumentByIdFilter<JournalDocument>(journalId, permissionKind))
      .FirstOrDefaultAsync();

    return JournalDocumentMapper.FromDocument<IJournal>(document);
  }

  private FilterDefinition<TDocument> GetJournalDocumentByIdFilter<TDocument>(string journalId, PermissionKind kind)
    where TDocument : IDocument
  {
    return Builders<TDocument>.Filter.And(
      GetAllJournalDocumentsFilter<TDocument>(kind),
      MongoUtil.GetDocumentByIdFilter<TDocument>(journalId)
    );
  }

  protected virtual FilterDefinition<TDocument> GetAllJournalDocumentsFilter<TDocument>(PermissionKind kind)
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
