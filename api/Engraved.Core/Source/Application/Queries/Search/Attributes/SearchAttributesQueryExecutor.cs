using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries.Journals.Get;
using Engraved.Core.Application.Queries.Measurements.GetAll;
using Engraved.Core.Application.Search;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;

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

    var measurementsQuery = new GetAllMeasurementsQuery { JournalId = _query.JournalId };
    IMeasurement[] measurements = await _query.GetDispatcher().Query(measurementsQuery);

    return _query
      .GetSearchIndex()
      .Search(
        _query.SearchText,
        journal.Attributes,
        measurements.Select(s => s.JournalAttributeValues).ToArray()
      );
  }
}
