using Engraved.Core.Application.Queries.Entries.GetAll;
using Engraved.Core.Application.Queries.Journals.GetAll;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Search.Entities;

public class SearchEntitiesQueryExecutor(Dispatcher dispatcher)
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
      .OrderByDescending(r => r.Entity.EditedOn)
      .ToArray();

    return new SearchEntitiesResult
    {
      Entities = searchResultEntities,
      Journals = entriesResult.Journals
    };
  }
}
