using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Persistence;

public interface IEntryRepository
{
  Task<IEntry[]> GetEntriesForJournal(
    string journalId,
    DateTime? fromDate = null,
    DateTime? toDate = null,
    IDictionary<string, string[]>? attributeValues = null,
    string? searchText = null,
    SortEntriesBy sortOrder = SortEntriesBy.DateTime
  );

  Task<IEntry[]> SearchEntries(
    string? searchText = null,
    ScheduleMode? scheduleMode = null,
    JournalType[]? journalTypes = null,
    string[]? journalIds = null,
    int? limit = null,
    string? currentUserId = null,
    bool onlyConsiderTitle = false,
    bool matchAnyWord = false
  );

  Task<UpsertResult> UpsertEntry<TEntry>(TEntry entry) where TEntry : IEntry;

  Task DeleteEntry(string entryId);

  Task<IEntry?> GetEntry(string entryId);
}
