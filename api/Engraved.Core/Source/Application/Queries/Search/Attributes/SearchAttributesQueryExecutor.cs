using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries.Entries.GetAllJournal;
using Engraved.Core.Application.Queries.Journals.Get;
using Engraved.Core.Application.Search;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Search.Attributes;

public class SearchAttributesQueryExecutor : IQueryExecutor<AttributeSearchResult[]>
{
  private readonly SearchAttributesQuery _query;

  public bool DisableCache => true;

  public SearchAttributesQueryExecutor(SearchAttributesQuery query)
  {
    _query = query;
  }

  public async Task<AttributeSearchResult[]> Execute(IRepository repository)
  {
    var journalQuery = new GetJournalQuery { JournalId = _query.JournalId };
    IJournal? journal = await _query.GetDispatcher().Query(journalQuery);

    if (journal == null)
    {
      throw new Exception("Journal not found.");
    }

    var entriesQuery = new GetAllJournalEntriesQuery { JournalId = _query.JournalId };
    IEntry[] entries = await _query.GetDispatcher().Query(entriesQuery);

    return _query
      .GetSearchIndex()
      .Search(
        _query.SearchText,
        journal.Attributes,
        entries.Select(s => s.JournalAttributeValues).ToArray()
      );
  }
}
