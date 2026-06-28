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

    var allEntries = await repository.SearchEntries(
      query.SearchText,
      query.ScheduledOnly ? ScheduleMode.CurrentUserOnly : ScheduleMode.None,
      query.JournalTypes,
      allJournalIds,
      query.Limit ?? 100,
      repository.CurrentUser.Value.Id,
      query.OnlyConsiderTitle.HasValue && query.OnlyConsiderTitle.Value
    );

    var entriesWithJournalToLoad = allEntries
      .Where(e => !allJournalIds.Contains(e.ParentId))
      .Select(e => e.ParentId)
      .Distinct()
      .ToArray();

    if (entriesWithJournalToLoad.Any())
    {
      var additionalJournals = (await Task.WhenAll(entriesWithJournalToLoad.Select(repository.GetJournal)))
        .Where(j => j != null)
        .Select(j => j!)
        .ToArray();

      allJournals = allJournals.UnionBy(additionalJournals, j => j.Id).ToArray();
    }

    if (query.ScheduledOnly)
    {
      var scheduledJournalIds = allJournals
        .Where(j => j.Schedules.Any())
        .Select(j => j.Id)
        .ToArray();

      var entriesToReturn = allEntries
        .Where(e => e.Schedules.Any())
        .ToArray();

      var journalIdsOfScheduledEntries = entriesToReturn
        .Select(e => e.ParentId)
        .Distinct()
        .ToArray();

      var allRelevantJournalIds = scheduledJournalIds.Union(journalIdsOfScheduledEntries).ToArray();

      return new SearchEntriesQueryResult
      {
        Journals = allJournals.Where(j => allRelevantJournalIds.Contains(j.Id)).ToArray(),
        Entries = entriesToReturn
      };
    }

    var relevantJournalIds = allEntries.Select(e => e.ParentId).Union(allJournals.Select(j => j.Id)).ToArray();

    var journalsToReturn = allJournals
      .Where(j => relevantJournalIds.Contains(j.Id))
      .ToArray();

    return new SearchEntriesQueryResult
    {
      Journals = journalsToReturn,
      Entries = allEntries.ToArray()
    };
  }
}
