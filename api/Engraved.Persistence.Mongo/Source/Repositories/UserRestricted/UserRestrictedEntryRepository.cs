using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Persistence.Mongo.Scoping;

namespace Engraved.Persistence.Mongo.Repositories.UserRestricted;

// Decorator adding the write guards for the current user on top of the entry repository (entry
// writes require write permission on the parent journal). Reads pass through: GetEntriesForJournal
// is scoped via the inner repository's journal access, while SearchEntries and GetEntry are
// unscoped primitives whose callers enforce access (see the comments in MongoEntryRepository).
public class UserRestrictedEntryRepository(MongoEntryRepository entryRepository, JournalWriteGuard writeGuard)
  : IEntryRepository
{
  public Task<IEntry[]> GetEntriesForJournal(
    string journalId,
    DateTime? fromDate = null,
    DateTime? toDate = null,
    IDictionary<string, string[]>? attributeValues = null,
    string? searchText = null,
    SortEntriesBy sortOrder = SortEntriesBy.DateTime
  )
  {
    return entryRepository.GetEntriesForJournal(journalId, fromDate, toDate, attributeValues, searchText, sortOrder);
  }

  public Task<IEntry[]> SearchEntries(
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
    return entryRepository.SearchEntries(
      searchText,
      scheduleMode,
      journalTypes,
      journalIds,
      limit,
      currentUserId,
      onlyConsiderTitle,
      matchAnyWord
    );
  }

  public Task<IEntry?> GetEntry(string entryId)
  {
    return entryRepository.GetEntry(entryId);
  }

  public Task<IEntry?> GetEntryByFileId(string fileId)
  {
    return entryRepository.GetEntryByFileId(fileId);
  }

  public Task<string[]> GetFileIdsForJournal(string journalId)
  {
    return entryRepository.GetFileIdsForJournal(journalId);
  }

  public async Task<UpsertResult> UpsertEntry<TEntry>(TEntry entry)
    where TEntry : IEntry
  {
    IEntry? existingEntry = string.IsNullOrEmpty(entry.Id) ? null : await entryRepository.GetEntry(entry.Id);

    if (existingEntry == null)
    {
      writeGuard.EnsureUserId(entry);
    }
    else
    {
      // Write access to an entry comes from the parent journal, not from owning the entry, so a
      // collaborator may update one that belongs to somebody else. Ensure we don't accidentally
      // change the owner while doing so - same rule as for journals in
      // UserRestrictedJournalRepository.
      entry.UserId = existingEntry.UserId;

      if (existingEntry.ParentId != entry.ParentId)
      {
        // the entry is being moved out of its current journal, which is a write there too
        await writeGuard.EnsureUserHasWritePermission(existingEntry.ParentId);
      }
    }

    await writeGuard.EnsureUserHasWritePermission(entry.ParentId);
    return await entryRepository.UpsertEntry(entry);
  }

  public async Task DeleteEntry(string entryId)
  {
    IEntry? entry = await entryRepository.GetEntry(entryId);
    if (entry == null)
    {
      return;
    }

    await writeGuard.EnsureUserHasWritePermission(entry.ParentId);
    await entryRepository.DeleteEntry(entryId);
  }

  public async Task DeleteEntriesForJournal(string journalId)
  {
    await writeGuard.EnsureUserHasWritePermission(journalId);
    await entryRepository.DeleteEntriesForJournal(journalId);
  }
}
