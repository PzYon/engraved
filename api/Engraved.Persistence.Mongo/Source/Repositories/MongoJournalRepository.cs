using System.Linq.Expressions;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Persistence.Mongo.DocumentTypes.Journals;
using Engraved.Persistence.Mongo.Scoping;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo.Repositories;

// Journal data access. Reads are shaped by the injected IReadScope; the write guards live on top of
// this (see UserRestrictedJournalRepository).
public class MongoJournalRepository(MongoDatabaseClient mongoDatabaseClient, IReadScope readScope)
  : IJournalRepository
{
  private IMongoCollection<JournalDocument> JournalsCollection => mongoDatabaseClient.JournalsCollection;

  public async Task<IJournal[]> GetAllJournals(
    string? searchText = null,
    ScheduleMode? scheduleMode = null,
    JournalType[]? journalTypes = null,
    string[]? journalIds = null,
    int? limit = null,
    string? currentUserId = null,
    bool matchAnyWord = false
  )
  {
    var filters = new List<FilterDefinition<JournalDocument>>();

    filters.Add(readScope.GetFilter<JournalDocument>(PermissionKind.Read));

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
        .Select(i => ObjectId.TryParse(i, out ObjectId id) ? (ObjectId?)id : null)
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
        throw new ArgumentException("Current user id is required", nameof(currentUserId));
      }

      // "scheduled" means a schedule with a pending occurrence: a fired schedule keeps its sub-document
      // (with NextOccurrence nulled out), so we must check NextOccurrence rather than mere existence.
      filters.Add(
        Builders<JournalDocument>.Filter.And(
          Builders<JournalDocument>.Filter.Exists($"Schedules.{currentUserId}"),
          Builders<JournalDocument>.Filter.Ne($"Schedules.{currentUserId}.NextOccurrence", BsonNull.Value)
        )
      );
    }

    if (!string.IsNullOrEmpty(searchText))
    {
      filters.AddRange(
        FreeTextFilters.Build<JournalDocument>(
          searchText,
          matchAnyWord,
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
    return await GetJournal(journalId, PermissionKind.Read, readScope);
  }

  public async Task<UpsertResult> UpsertJournal(IJournal journal)
  {
    JournalDocument document = JournalDocumentMapper.ToDocument(journal);

    ReplaceOneResult? replaceOneResult = await JournalsCollection.ReplaceOneAsync(
      MongoUtil.GetDocumentByIdFilter<JournalDocument>(journal.Id),
      document,
      new ReplaceOptions { IsUpsert = true }
    );

    return MongoUtil.CreateUpsertResult(journal.Id, replaceOneResult);
  }

  // deletes only the journal document itself - deleting its entries is a use-case rule owned by
  // DeleteJournalCommandExecutor (via IEntryRepository.DeleteEntriesForJournal)
  public async Task DeleteJournal(string journalId)
  {
    IJournal? journal = await GetJournal(journalId);
    if (journal == null)
    {
      return;
    }

    await JournalsCollection.DeleteOneAsync(
      MongoUtil.GetDocumentByIdFilter<JournalDocument>(journalId)
    );
  }

  // Explicitly unscoped read: loads the journal regardless of the caller's read permissions, so the
  // caller can apply the permission rule in memory (the write guards) or read the owner of a journal
  // it is about to update. Deliberately not part of IJournalRepository.
  public Task<IJournal?> GetJournalUnscoped(string journalId)
  {
    return GetJournal(journalId, PermissionKind.None, UnrestrictedReadScope.Instance);
  }

  private async Task<IJournal?> GetJournal(string journalId, PermissionKind permissionKind, IReadScope scope)
  {
    if (string.IsNullOrEmpty(journalId))
    {
      throw new ArgumentNullException(nameof(journalId), "Id must be specified.");
    }

    JournalDocument? document = await JournalsCollection
      .Find(
        Builders<JournalDocument>.Filter.And(
          MongoUtil.GetDocumentByIdFilter<JournalDocument>(journalId),
          scope.GetFilter<JournalDocument>(permissionKind)
        )
      )
      .FirstOrDefaultAsync();

    return JournalDocumentMapper.FromDocument(document);
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
      JournalType.LogBook => d => d.GetType() == typeof(LogBookJournalDocument),
      _ => throw new ArgumentOutOfRangeException(
        nameof(journalType),
        journalType,
        $"{nameof(GetIsJournalTypeExpression)} not defined for {journalType}."
      )
    };
  }
}
