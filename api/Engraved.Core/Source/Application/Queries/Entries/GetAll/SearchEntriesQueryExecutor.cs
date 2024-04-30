using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Entries.GetAll;

public class SearchEntriesQueryExecutor(IUserScopedRepository repository)
  : IQueryExecutor<SearchEntriesQueryResult, SearchEntriesQuery>
{
  public bool DisableCache => false;

  public async Task<SearchEntriesQueryResult> Execute(SearchEntriesQuery query)
  {
    IJournal[] allJournals = await repository.GetAllJournals(null, null, null, null, 100);
    string[] allJournalIds = allJournals.Select(j => j.Id!).ToArray();

    IEntry[] allEntries = await repository.SearchEntries(
      query.SearchText,
      query.ScheduledOnly ? repository.CurrentUser.Value.Id : null,
      query.JournalTypes,
      allJournalIds,
      query.Limit ?? 20,
      repository.CurrentUser.Value.Id
    );

    string[] relevantJournalIds = allEntries.Select(e => e.ParentId).ToArray();

    return new SearchEntriesQueryResult
    {
      Journals = allJournals.Where(j => relevantJournalIds.Contains(j.Id)).ToArray(),
      Entries = allEntries.ToArray()
    };
  }
}
