using Engraved.Core.Application.Queries.Entries.GetAll;
using Engraved.Core.Application.Queries.Journals.GetAll;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Queries.Search.Entities;

public class SearchEntitiesQueryExecutor(Dispatcher dispatcher, ICurrentUserService currentUserService)
  : IQueryExecutor<SearchEntitiesResult, SearchEntitiesQuery>
{
  public bool DisableCache => false;

  public async Task<SearchEntitiesResult> Execute(SearchEntitiesQuery query)
  {
    Task<IJournal[]> journalsTask = dispatcher.Query<IJournal[], GetAllJournalsQuery>(
      new GetAllJournalsQuery
      {
        SearchText = query.SearchText,
        ScheduledOnly = query.ScheduledOnly
      }
    );

    Task<SearchEntriesQueryResult> entriesTask = dispatcher.Query<SearchEntriesQueryResult, SearchEntriesQuery>(
      new SearchEntriesQuery
      {
        SearchText = query.SearchText,
        ScheduledOnly = query.ScheduledOnly,
        JournalTypes = query.OnlyEntriesOfTypes,
        OnlyConsiderTitle = query.OnlyConsiderTitle
      }
    );

    // execute in parallel
    await Task.WhenAll(journalsTask, entriesTask);

    var searchResultEntities = journalsTask.Result
      .Select(journal => new SearchResultEntity { EntityType = EntityType.Journal, Entity = journal })
      .Union(
        entriesTask.Result.Entries.Select(entry => new SearchResultEntity
          { EntityType = EntityType.Entry, Entity = entry }
        )
      )
      .ToArray();

    return new SearchEntitiesResult
    {
      Entities = await GetSortedResults(query, searchResultEntities),
      Journals = entriesTask.Result.Journals
    };
  }

  private async Task<SearchResultEntity[]> GetSortedResults(
    SearchEntitiesQuery query,
    SearchResultEntity[] searchResultEntities
  )
  {
    if (!query.ScheduledOnly)
    {
      return searchResultEntities.OrderByDescending(e => e.Entity.EditedOn).ToArray();
    }

    IUser user = await currentUserService.LoadUser();
    return searchResultEntities
      .OrderBy(e => e.Entity.Schedules.ContainsKey(user.Id ?? "")
        ? e.Entity.Schedules[user.Id ?? ""].NextOccurrence
        : null
      )
      .ToArray();
  }
}
