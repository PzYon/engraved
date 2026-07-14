using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Queries.Entries.Search;

public class SearchEntriesQueryExecutor(
  IJournalRepository journalRepository,
  IEntryRepository entryRepository,
  Lazy<IUser> currentUser
)
  : IQueryExecutor<SearchEntriesQueryResult, SearchEntriesQuery>
{
  public bool DisableCache => false;

  public async Task<SearchEntriesQueryResult> Execute(SearchEntriesQuery query)
  {
    var allJournals = await journalRepository.GetAllJournals(null, null, null, null, 1000);
    var allJournalIds = allJournals.Select(j => j.Id!).ToArray();

    // for "scheduled only" we ask the repository to return just the entries that have a schedule
    // for the current user. Doing this in the query (rather than filtering in memory afterwards)
    // keeps the result limit meaningful - we don't want to fetch 100 arbitrary entries and then
    // discard the unscheduled ones.
    var allEntries = await entryRepository.SearchEntries(
      query.SearchText,
      query.ScheduledOnly ? ScheduleMode.CurrentUserOnly : ScheduleMode.None,
      query.JournalTypes,
      allJournalIds,
      query.Limit ?? 100,
      currentUser.Value.Id,
      query.OnlyConsiderTitle.HasValue && query.OnlyConsiderTitle.Value
    );

    // only the journals that own a matched entry are returned, so the client can render
    // each entry together with its parent journal.
    var relevantJournalIds = allEntries.Select(e => e.ParentId).ToArray();

    return new SearchEntriesQueryResult
    {
      Journals = allJournals.Where(j => relevantJournalIds.Contains(j.Id)).ToArray(),
      Entries = allEntries.ToArray()
    };
  }
}
