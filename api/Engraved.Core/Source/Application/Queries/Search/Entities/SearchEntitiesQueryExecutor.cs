using Engraved.Core.Application.Queries.Entries.GetAll;
using Engraved.Core.Application.Queries.Journals.GetAll;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.User;

namespace Engraved.Core.Application.Queries.Search.Entities;

public class SearchEntitiesQueryExecutor(Dispatcher dispatcher, ICurrentUserService currentUserService)
  : IQueryExecutor<SearchEntitiesResult, SearchEntitiesQuery>
{
  public bool DisableCache => false;

  public async Task<SearchEntitiesResult> Execute(SearchEntitiesQuery query)
  {
    IJournal[] journals = await dispatcher.Query<IJournal[], GetAllJournalsQuery>(
      new GetAllJournalsQuery
      {
        SearchText = query.SearchText,
        ScheduledOnly = query.ScheduledOnly
      }
    );

    GetAllEntriesQueryResult entriesResult = await dispatcher.Query<GetAllEntriesQueryResult, GetAllEntriesQuery>(
      new GetAllEntriesQuery
      {
        SearchText = query.SearchText,
        ScheduledOnly = query.ScheduledOnly
      }
    );

    SearchResultEntity[] searchResultEntities = journals.Select(
        journal => new SearchResultEntity { EntityType = EntityType.Journal, Entity = journal }
      )
      .Union(
        entriesResult.Entries.Select(
          entry => new SearchResultEntity { EntityType = EntityType.Entry, Entity = entry }
        )
      )
      .ToArray();

    return new SearchEntitiesResult
    {
      Entities = await GetSortedResults(query, searchResultEntities),
      Journals = entriesResult.Journals
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
      .OrderBy(
        e => e.Entity.Schedules.ContainsKey(user.Id ?? "") ? e.Entity.Schedules[user.Id ?? ""].NextOccurrence : null
      )
      .ToArray();
  }
}
