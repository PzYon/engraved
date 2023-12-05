using Engraved.Core.Application.Queries.Entries.GetAll;
using Engraved.Core.Application.Queries.Journals.GetAll;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Search.Entities;

public class SearchEntitiesQueryExecutor(Dispatcher dispatcher)
  : IQueryExecutor<IEntity[], SearchEntitiesQuery>
{
  public bool DisableCache => false;

  public async Task<IEntity[]> Execute(SearchEntitiesQuery query)
  {
    if (string.IsNullOrEmpty(query.SearchText))
    {
      return Array.Empty<IEntity>();
    }
    
    var journalsQuery = new GetAllJournalsQuery { SearchText = query.SearchText };
    IJournal[] journals = await dispatcher.Query<IJournal[], GetAllJournalsQuery>(journalsQuery);

    var entriesQuery = new GetAllEntriesQuery { SearchText = query.SearchText };
    GetAllEntriesQueryResult entriesResult =
      await dispatcher.Query<GetAllEntriesQueryResult, GetAllEntriesQuery>(entriesQuery);

    return journals.Cast<IEntity>()
      .Union(entriesResult.Entries)
      .OrderByDescending(c => c.EditedOn)
      .ToArray();
  }
}
