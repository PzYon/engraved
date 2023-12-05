using Engraved.Core.Application.Queries.Entries.GetAll;
using Engraved.Core.Application.Queries.Journals.GetAll;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Search.Entities;

public enum EntityType
{
  Journal,
  Entry
}

public class SearchResultEntity
{
  public IEntity Entity { get; set; }

  public EntityType EntityType { get; set; }
}

public class SearchEntitiesResult
{
  public SearchResultEntity[] Entities { get; set; } = Array.Empty<SearchResultEntity>();

  public IJournal[] Journals { get; set; } = Array.Empty<IJournal>();
}

public class SearchEntitiesQueryExecutor(Dispatcher dispatcher)
  : IQueryExecutor<SearchEntitiesResult, SearchEntitiesQuery>
{
  public bool DisableCache => false;

  public async Task<SearchEntitiesResult> Execute(SearchEntitiesQuery query)
  {
    if (string.IsNullOrEmpty(query.SearchText))
    {
      return new SearchEntitiesResult();
    }

    var journalsQuery = new GetAllJournalsQuery { SearchText = query.SearchText };
    IJournal[] journals = await dispatcher.Query<IJournal[], GetAllJournalsQuery>(journalsQuery);

    var entriesQuery = new GetAllEntriesQuery { SearchText = query.SearchText };
    GetAllEntriesQueryResult entriesResult =
      await dispatcher.Query<GetAllEntriesQueryResult, GetAllEntriesQuery>(entriesQuery);

    IEnumerable<SearchResultEntity> searchResultEntities = journals.Cast<IEntity>()
      .Union(entriesResult.Entries)
      .OrderByDescending(c => c.EditedOn)
      .Select(
        e => new SearchResultEntity
        {
          EntityType = e.GetType() == typeof(IJournal) ? EntityType.Journal : EntityType.Entry,
          Entity = e
        }
      )
      .ToArray();
    
    return new SearchEntitiesResult
    {
      Entities = searchResultEntities.ToArray(),
      Journals = entriesResult.Journals
    };
  }
}
