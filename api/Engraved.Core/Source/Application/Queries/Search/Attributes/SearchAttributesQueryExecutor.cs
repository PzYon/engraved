using Engraved.Core.Application.Queries.Entries.GetAllJournal;
using Engraved.Core.Application.Queries.Journals.Get;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Search.Attributes;

public class SearchAttributesQueryExecutor : IQueryExecutor<SearchAttributesResult[], SearchAttributesQuery>
{
  private readonly Dispatcher _dispatcher;
  private readonly ISearchIndex _searchIndex;

  public bool DisableCache => true;

  public SearchAttributesQueryExecutor(Dispatcher dispatcher, ISearchIndex searchIndex)
  {
    _dispatcher = dispatcher;
    _searchIndex = searchIndex;
  }

  public async Task<SearchAttributesResult[]> Execute(SearchAttributesQuery query)
  {
    var journalQuery = new GetJournalQuery { JournalId = query.JournalId };
    IJournal? journal = await _dispatcher.Query<IJournal?, GetJournalQuery>(journalQuery);

    if (journal == null)
    {
      throw new Exception("Journal not found.");
    }

    var entriesQuery = new GetAllJournalEntriesQuery { JournalId = query.JournalId };
    IEntry[] entries = await _dispatcher.Query<IEntry[], GetAllJournalEntriesQuery>(entriesQuery);

    return _searchIndex.Search(
      query.SearchText,
      journal.Attributes,
      entries.Select(s => s.JournalAttributeValues).ToArray()
    );
  }
}
