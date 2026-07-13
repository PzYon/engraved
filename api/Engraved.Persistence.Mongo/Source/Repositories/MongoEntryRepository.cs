using System.Linq.Expressions;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Persistence.Mongo.DocumentTypes.Entries;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo.Repositories;

// Entry data access. Note that this repository takes no IReadScope: entry read-scoping is derived
// entirely from journal permissions, so GetEntriesForJournal delegates the permission decision to
// the (scoped) journal repository, while SearchEntries and GetEntry are unscoped primitives whose
// callers enforce access themselves (see the comments on those methods).
public class MongoEntryRepository(MongoDatabaseClient mongoDatabaseClient, MongoJournalRepository journalRepository)
  : IEntryRepository
{
  private IMongoCollection<EntryDocument> EntriesCollection => mongoDatabaseClient.EntriesCollection;

  public async Task<IEntry[]> GetEntriesForJournal(
    string journalId,
    DateTime? fromDate = null,
    DateTime? toDate = null,
    IDictionary<string, string[]>? attributeValues = null,
    string? searchText = null,
    SortEntriesBy sortOrder = SortEntriesBy.DateTime
  )
  {
    // permission gate: the scoped journal repository returns null when the caller may not read the
    // journal, in which case its entries are hidden too
    IJournal? journal = await journalRepository.GetJournal(journalId);
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
        FreeTextFilters.Build<EntryDocument>(
          searchText,
          false,
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

    SortDefinition<EntryDocument> sort = sortOrder == SortEntriesBy.EditedOn
      ? Builders<EntryDocument>.Sort.Descending(d => d.EditedOn)
      : Builders<EntryDocument>.Sort.Descending(d => d.DateTime);

    var entries = await EntriesCollection
      .Find(Builders<EntryDocument>.Filter.And(filters))
      .Sort(sort)
      .ToListAsync();

    return entries
      .Select(EntryDocumentMapper.FromDocument)
      .ToArray();
  }

  // Unscoped primitive: this method does NOT enforce journal read-permission. It trusts the
  // journalIds supplied by the caller. The only scoped caller, SearchEntriesQueryExecutor, first
  // resolves the current user's accessible journals (via the scoped GetAllJournals) and passes
  // those ids in, so read access is enforced there. Pinned by
  // UserRestrictedMongoRepository_Permissions_Should.SearchEntries_IsUnscoped_TrustsCallerProvidedJournalIds.
  public async Task<IEntry[]> SearchEntries(
    string? searchText,
    ScheduleMode? scheduleMode = null,
    JournalType[]? journalTypes = null,
    string[]? journalIds = null,
    int? limit = null,
    string? currentUserId = null,
    bool onlyConsiderTitle = false,
    bool matchAnyWord = false
  )
  {
    var filters = new List<FilterDefinition<EntryDocument>>();

    if (!string.IsNullOrEmpty(searchText))
    {
      filters.AddRange(
        FreeTextFilters.Build<EntryDocument>(
          searchText,
          matchAnyWord,
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
        throw new ArgumentException("Current user id is required", nameof(currentUserId));
      }

      filters.Add(GetHasScheduleForCurrentUserFilter(currentUserId));
    }

    // Ordering is done at the DB level (see defaultSort below, and the CurrentUserFirst branch in
    // LoadDocuments). We deliberately do NOT re-order scheduled entries to the front here: the entries
    // tab (ScheduleMode.None) must stay sorted purely by edited date, and the scheduled tab
    // (CurrentUserOnly) already contains only scheduled entries.
    return await LoadData(
      limit,
      scheduleMode,
      currentUserId,
      filters,
      Builders<EntryDocument>.Sort.Descending(d => d.EditedOn).Descending(d => d.Id)
    );
  }

  public async Task<UpsertResult> UpsertEntry<TEntry>(TEntry entry)
    where TEntry : IEntry
  {
    EntryDocument document = EntryDocumentMapper.ToDocument(entry);

    ReplaceOneResult? replaceOneResult = await EntriesCollection.ReplaceOneAsync(
      MongoUtil.GetDocumentByIdFilter<EntryDocument>(entry.Id),
      document,
      new ReplaceOptions { IsUpsert = true }
    );

    return MongoUtil.CreateUpsertResult(entry.Id, replaceOneResult);
  }

  public async Task DeleteEntry(string entryId)
  {
    await EntriesCollection.DeleteOneAsync(MongoUtil.GetDocumentByIdFilter<EntryDocument>(entryId));
  }

  // Unscoped primitive: GetEntry does NOT enforce read-permission on the parent journal. The
  // client-facing single-entry read enforces access in GetEntryQueryExecutor; command executors use
  // it as a load-for-modify primitive and rely on the subsequent UpsertEntry/DeleteEntry write
  // checks. Pinned by
  // UserRestrictedMongoRepository_Permissions_Should.GetEntry_IsUnscoped_ReturnsEntry_EvenWithoutJournalPermission.
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
      throw new ArgumentException(
        $"\"{nameof(currentUserId)}\" must be specified when using {ScheduleMode.CurrentUserFirst}."
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

  private static FilterDefinition<EntryDocument> GetHasScheduleForCurrentUserFilter(string currentUserId)
  {
    // "scheduled" means the user has a schedule with a pending occurrence. A schedule sub-document is
    // kept around after it has fired (with NextOccurrence set to null), so checking mere existence of
    // the sub-document would wrongly surface already-fired schedules as "scheduled".
    return Builders<EntryDocument>.Filter.And(
      Builders<EntryDocument>.Filter.Exists($"Schedules.{currentUserId}"),
      Builders<EntryDocument>.Filter.Ne($"Schedules.{currentUserId}.NextOccurrence", BsonNull.Value)
    );
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
      case JournalType.LogBook:
        return d => d.GetType() == typeof(LogBookEntryDocument);
      default:
        throw new ArgumentOutOfRangeException(
          nameof(journalType),
          journalType,
          $"{nameof(GetIsEntryTypeExpression)} not defined for {journalType}."
        );
    }
  }
}
