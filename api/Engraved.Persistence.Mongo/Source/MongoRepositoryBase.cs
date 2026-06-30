using System.Linq.Expressions;
using System.Text.RegularExpressions;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;
using Engraved.Persistence.Mongo.DocumentTypes;
using Engraved.Persistence.Mongo.DocumentTypes.Entries;
using Engraved.Persistence.Mongo.DocumentTypes.Journals;
using Engraved.Persistence.Mongo.DocumentTypes.Users;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo;

// Shared MongoDB data access for the user/journal/entry roles. Concrete repositories derive from
// this and supply the read-shaping filter via GetAllJournalDocumentsFilter:
//  - UnrestrictedMongoRepository:  no filter (full access) plus the maintenance operations
//  - UserRestrictedMongoRepository: the per-user permission filter plus the write guards
public abstract class MongoRepositoryBase(MongoDatabaseClient mongoDatabaseClient)
  : IUserRepository, IJournalRepository, IEntryRepository
{
  // protected so they can be accessed from derived repositories (and the test repositories)
  protected IMongoCollection<EntryDocument> EntriesCollection => mongoDatabaseClient.EntriesCollection;
  protected IMongoCollection<JournalDocument> JournalsCollection => mongoDatabaseClient.JournalsCollection;
  protected IMongoCollection<UserDocument> UsersCollection => mongoDatabaseClient.UsersCollection;

  public virtual async Task<IUser?> GetUser(string? nameOrId)
  {
    if (string.IsNullOrEmpty(nameOrId))
    {
      throw new ArgumentNullException(nameof(nameOrId), "Username or ID must be specified.");
    }

    var filterDefinition = ObjectId.TryParse(nameOrId, out ObjectId id)
      ? Builders<UserDocument>.Filter.Where(d => d.Id == id)
      : Builders<UserDocument>.Filter.Where(d => d.Name == nameOrId);

    UserDocument? document = await UsersCollection
      .Find(filterDefinition)
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
      return [];
    }

    var users = await UsersCollection
      .Find(Builders<UserDocument>.Filter.Or(userIds.Distinct().Select(MongoUtil.GetDocumentByIdFilter<UserDocument>)))
      .ToListAsync();

    return users.Select(u => UserDocumentMapper.FromDocument(u)!).ToArray();
  }

  public async Task<IUser[]> GetAllUsers()
  {
    var users = await UsersCollection
      .Find(MongoUtil.GetAllDocumentsFilter<UserDocument>())
      .ToListAsync();

    return users.Select(u => UserDocumentMapper.FromDocument(u)!).ToArray();
  }

  public async Task<IJournal[]> GetAllJournals(
    string? searchText = null,
    ScheduleMode? scheduleMode = null,
    JournalType[]? journalTypes = null,
    string[]? journalIds = null,
    int? limit = null,
    string? currentUserId = null
  )
  {
    var filters = new List<FilterDefinition<JournalDocument>>();

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
      var objectIds = journalIds
        .Select(i => ObjectId.TryParse(i, out var id) ? (ObjectId?) id : null)
        .Where(id => id.HasValue)
        .Select(id => id!.Value)
        .ToList();

      if (objectIds.Any())
      {
        filters.Add(Builders<JournalDocument>.Filter.In(d => d.Id, objectIds));
      }
      else
      {
        // if IDs were provided but none were valid ObjectIds, we should return nothing
        filters.Add(Builders<JournalDocument>.Filter.Where(d => false));
      }
    }

    if (scheduleMode == ScheduleMode.AnySchedule)
    {
      filters.Add(
        Builders<JournalDocument>.Filter.Exists(d => d.Schedules)
      );
    }
    if (scheduleMode == ScheduleMode.CurrentUserOnly)
    {
      if (string.IsNullOrEmpty(currentUserId))
      {
        throw new Exception("Current user id is required");
      }

      filters.Add(Builders<JournalDocument>.Filter.And(
        Builders<JournalDocument>.Filter.Exists($"Schedules.{currentUserId}"),
        Builders<JournalDocument>.Filter.Ne($"Schedules.{currentUserId}", BsonNull.Value)
      ));
    }

    if (!string.IsNullOrEmpty(searchText))
    {
      filters.AddRange(
        GetFreeTextFilters<JournalDocument>(
          searchText,
          d => d.Name!,
          d => d.Description!
        )
      );
    }

    var journals = await JournalsCollection
      .Find(filters.Count > 0 ? Builders<JournalDocument>.Filter.And(filters) : Builders<JournalDocument>.Filter.Empty)
      .Sort(Builders<JournalDocument>.Sort.Descending(d => d.EditedOn).Descending(d => d.Id))
      .Limit(limit)
      .ToListAsync();

    return journals.Select(j => JournalDocumentMapper.FromDocument(j)!).ToArray();
  }

  public async Task<IJournal?> GetJournal(string journalId)
  {
    return await GetJournal(journalId, PermissionKind.Read);
  }

  public async Task<IEntry[]> GetEntriesForJournal(
    string journalId,
    DateTime? fromDate = null,
    DateTime? toDate = null,
    IDictionary<string, string[]>? attributeValues = null,
    string? searchText = null
  )
  {
    IJournal? journal = await GetJournal(journalId);
    if (journal == null)
    {
      return [];
    }

    var filters = new List<FilterDefinition<EntryDocument>>
    {
      Builders<EntryDocument>.Filter.Where(d => d.ParentId == journalId)
    };

    if (!string.IsNullOrEmpty(searchText))
    {
      filters.AddRange(
        GetFreeTextFilters<EntryDocument>(
          searchText,
          d => d.Notes!,
          d => ((ScrapsEntryDocument) d).Title!
        )
      );
    }

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
        attributeValues.Select(attributeValue =>
          Builders<EntryDocument>.Filter.In($"JournalAttributeValues.{attributeValue.Key}", attributeValue.Value)
        )
      );
    }

    var entries = await EntriesCollection
      .Find(Builders<EntryDocument>.Filter.And(filters))
      .Sort(Builders<EntryDocument>.Sort.Descending(d => d.DateTime))
      .ToListAsync();

    return entries
      .Select(EntryDocumentMapper.FromDocument)
      .ToArray();
  }

  // Unscoped primitive: this method does NOT enforce journal read-permission. It trusts the
  // journalIds supplied by the caller. The only scoped caller, SearchEntriesQueryExecutor, first
  // resolves the current user's accessible journals (via the scoped GetAllJournals) and passes
  // those ids in, so read access is enforced there. Pinned by
  // UserScopedMongoRepository_Permissions_Should.SearchEntries_IsUnscoped_TrustsCallerProvidedJournalIds.
  public async Task<IEntry[]> SearchEntries(
    string? searchText,
    ScheduleMode? scheduleMode = null,
    JournalType[]? journalTypes = null,
    string[]? journalIds = null,
    int? limit = null,
    string? currentUserId = null,
    bool onlyConsiderTitle = false
  )
  {
    var filters = new List<FilterDefinition<EntryDocument>>();

    if (!string.IsNullOrEmpty(searchText))
    {
      filters.AddRange(
        GetFreeTextFilters<EntryDocument>(
          searchText,
          onlyConsiderTitle
            ? [d => ((ScrapsEntryDocument) d).Title!]
            : [d => ((ScrapsEntryDocument) d).Title!, d => d.Notes!]
        )
      );
    }

    if (journalIds is { Length: > 0 })
    {
      filters.Add(Builders<EntryDocument>.Filter.In(d => d.ParentId, journalIds));
    }

    if (journalTypes is { Length: > 0 })
    {
      filters.Add(
        Builders<EntryDocument>.Filter.Or(
          journalTypes.Select(t => Builders<EntryDocument>.Filter.Where(GetIsEntryTypeExpression(t)))
        )
      );
    }

    if (scheduleMode == ScheduleMode.AnySchedule)
    {
      filters.Add(
        Builders<EntryDocument>.Filter.Exists(d => d.Schedules)
      );
    }
    else if (scheduleMode == ScheduleMode.CurrentUserOnly)
    {
      if (string.IsNullOrEmpty(currentUserId))
      {
        throw new Exception("Current user id is required");
      }

      filters.Add(GetHasScheduleForCurrentUserFilter(currentUserId));
    }

    var entries = await LoadData(
      limit,
      scheduleMode,
      currentUserId,
      filters,
      Builders<EntryDocument>.Sort.Descending(d => d.EditedOn).Descending(d => d.Id)
    );

    return entries.OrderByDescending(e => e.Schedules.ContainsKey(currentUserId ?? "") && e.Schedules[currentUserId ?? ""].NextOccurrence != null)
      .ThenByDescending(e => e.EditedOn)
      .ThenByDescending(e => e.Id)
      .ToArray();
  }

  private async Task<IEntry[]> LoadData(
    int? limit,
    ScheduleMode? scheduleMode,
    string? currentUserId,
    List<FilterDefinition<EntryDocument>> filters,
    SortDefinition<EntryDocument> defaultSort
  )
  {
    List<EntryDocument> documents = await LoadDocuments(
      limit,
      scheduleMode,
      currentUserId,
      filters,
      defaultSort
    );

    return documents
      .Select(EntryDocumentMapper.FromDocument)
      .ToArray();
  }

  private async Task<List<EntryDocument>> LoadDocuments(
    int? limit,
    ScheduleMode? scheduleMode,
    string? currentUserId,
    List<FilterDefinition<EntryDocument>> filters,
    SortDefinition<EntryDocument> defaultSort
  )
  {
    if (scheduleMode != ScheduleMode.CurrentUserFirst)
    {
      return await EntriesCollection
        .Find(
          filters.Count > 0
            ? Builders<EntryDocument>.Filter.And(filters)
            : Builders<EntryDocument>.Filter.Empty
        )
        .Sort(defaultSort)
        .Limit(limit)
        .ToListAsync();
    }

    if (string.IsNullOrEmpty(currentUserId))
    {
      throw new Exception(
        $"\"${nameof(currentUserId)}\" must be specified when using {ScheduleMode.CurrentUserFirst}."
      );
    }

    var entries = await EntriesCollection
      .Find(
        Builders<EntryDocument>.Filter.And(
          filters.Union([GetHasScheduleForCurrentUserFilter(currentUserId)])
        )
      )
      .Sort(Builders<EntryDocument>.Sort.Ascending(d => d.Schedules[currentUserId].NextOccurrence))
      .Limit(limit)
      .ToListAsync();

    var foundIds = entries.Select(e => e.Id).ToArray();

    entries.AddRange(
      await EntriesCollection
        .Find(
          Builders<EntryDocument>.Filter.And(
            filters.Concat([Builders<EntryDocument>.Filter.Nin(d => d.Id, foundIds)])
          )
        )
        .Sort(defaultSort)
        .Limit(limit - entries.Count)
        .ToListAsync()
    );

    return entries;
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

  public virtual async Task DeleteEntry(string entryId)
  {
    await EntriesCollection.DeleteOneAsync(MongoUtil.GetDocumentByIdFilter<EntryDocument>(entryId));
  }

  // Unscoped primitive: GetEntry does NOT enforce read-permission on the parent journal (note it is
  // not overridden in UserRestrictedMongoRepository). The client-facing single-entry read enforces
  // access in GetEntryQueryExecutor; command executors use it as a load-for-modify primitive and
  // rely on the subsequent UpsertEntry/DeleteEntry write checks. Pinned by
  // UserScopedMongoRepository_Permissions_Should.GetEntry_IsUnscoped_ReturnsEntry_EvenWithoutJournalPermission.
  public async Task<IEntry?> GetEntry(string entryId)
  {
    if (string.IsNullOrEmpty(entryId))
    {
      throw new ArgumentNullException(nameof(entryId), "Id must be specified.");
    }

    EntryDocument? document = await EntriesCollection
      .Find(MongoUtil.GetDocumentByIdFilter<EntryDocument>(entryId))
      .FirstOrDefaultAsync();

    return document == null
      ? null
      : EntryDocumentMapper.FromDocument(document);
  }

  // there must be a better solution than this, but it works for the moment... i believe
  // Builders<JournalDocument>.Filter.Where(t => t.Type == journalType) does not work because
  // JournalDocument.Type is an ABSTRACT property.
  private static Expression<Func<JournalDocument, bool>> GetIsJournalTypeExpression(JournalType journalType)
  {
    return journalType switch
    {
      JournalType.Counter => d => d.GetType() == typeof(CounterJournalDocument),
      JournalType.Gauge => d => d.GetType() == typeof(GaugeJournalDocument),
      JournalType.Timer => d => d.GetType() == typeof(TimerJournalDocument),
      JournalType.Scraps => d => d.GetType() == typeof(ScrapsJournalDocument),
      _ => throw new ArgumentOutOfRangeException(
        nameof(journalType),
        journalType,
        $"{nameof(GetIsJournalTypeExpression)} not defined for {journalType}."
      )
    };
  }

  private static Expression<Func<EntryDocument, bool>> GetIsEntryTypeExpression(JournalType journalType)
  {
    switch (journalType)
    {
      case JournalType.Counter:
        return d => d.GetType() == typeof(CounterEntryDocument);
      case JournalType.Gauge:
        return d => d.GetType() == typeof(GaugeEntryDocument);
      case JournalType.Timer:
        return d => d.GetType() == typeof(TimerEntryDocument);
      case JournalType.Scraps:
        return d => d.GetType() == typeof(ScrapsEntryDocument);
      default:
        throw new ArgumentOutOfRangeException(
          nameof(journalType),
          journalType,
          $"{nameof(GetIsEntryTypeExpression)} not defined for {journalType}."
        );
    }
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

    return JournalDocumentMapper.FromDocument(document);
  }

  private FilterDefinition<TDocument> GetJournalDocumentByIdFilter<TDocument>(string journalId, PermissionKind kind)
    where TDocument : IDocument
  {
    return Builders<TDocument>.Filter.And(
      MongoUtil.GetDocumentByIdFilter<TDocument>(journalId),
      GetAllJournalDocumentsFilter<TDocument>(kind)
    );
  }

  // Read-shaping hook: derived repositories restrict journal/entry queries to what the caller may
  // read. UnrestrictedMongoRepository returns "everything"; UserRestrictedMongoRepository returns
  // the per-user permission filter.
  protected abstract FilterDefinition<TDocument> GetAllJournalDocumentsFilter<TDocument>(PermissionKind kind)
    where TDocument : IDocument;

  private static UpsertResult CreateUpsertResult(string? entityId, ReplaceOneResult replaceOneResult)
  {
    var id = (string.IsNullOrEmpty(entityId)
      ? replaceOneResult.UpsertedId.ToString()
      : entityId)!;

    return new UpsertResult
    {
      EntityId = id
    };
  }

  private static FilterDefinition<EntryDocument> GetHasScheduleForCurrentUserFilter(string currentUserId)
  {
    return Builders<EntryDocument>.Filter.And(
      Builders<EntryDocument>.Filter.Exists($"Schedules.{currentUserId}"),
      Builders<EntryDocument>.Filter.Ne($"Schedules.{currentUserId}", BsonNull.Value)
    );
  }

  private static List<FilterDefinition<T>> GetFreeTextFilters<T>(
    string? searchText,
    params Expression<Func<T, object>>[] fieldNameExpressions
  ) where T : IDocument
  {
    if (string.IsNullOrEmpty(searchText))
    {
      return [];
    }

    return searchText.Split(" ")
      .Select(segment =>
        {
          // Escape the user input so it is matched literally. Passing it to the
          // regex engine unescaped allowed malformed patterns (exceptions) and
          // catastrophic-backtracking patterns (ReDoS) to be injected via search.
          return Builders<T>.Filter.Or(
            fieldNameExpressions.Select(exp => Builders<T>.Filter.Regex(
                exp,
                new BsonRegularExpression(
                  new Regex(Regex.Escape(segment), RegexOptions.IgnoreCase | RegexOptions.Multiline)
                )
              )
            )
          );
        }
      )
      .ToList();
  }
}
