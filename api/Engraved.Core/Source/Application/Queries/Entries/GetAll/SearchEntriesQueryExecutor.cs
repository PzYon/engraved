using Engraved.Core.Application.Persistence;

namespace Engraved.Core.Application.Queries.Entries.GetAll;

public class SearchEntriesQueryExecutor(IUserScopedRepository repository)
  : IQueryExecutor<SearchEntriesQueryResult, SearchEntriesQuery>
{
  public bool DisableCache => false;

  public async Task<SearchEntriesQueryResult> Execute(SearchEntriesQuery query)
  {
    var allJournals = await repository.GetAllJournals(null, null, null, null, 1000);
    var allJournalIds = allJournals.Select(j => j.Id!).ToArray();

    // entries are surfaced by text/type/journal scope only. "scheduled only" filtering is
    // applied to the journal entities (see GetAllJournalsQueryExecutor), not to entries:
    // an entry living inside a scheduled journal stays relevant even without its own schedule.
    var allEntries = await repository.SearchEntries(
      query.SearchText,
      ScheduleMode.None,
      query.JournalTypes,
      allJournalIds,
      query.Limit ?? 100,
      repository.CurrentUser.Value.Id,
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
