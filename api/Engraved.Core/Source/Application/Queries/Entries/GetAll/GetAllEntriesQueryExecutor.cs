using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Entries.GetAll;

public class GetAllEntriesQueryExecutor : IQueryExecutor<GetAllEntriesQueryResult, GetAllEntriesQuery>
{
  private readonly IBaseRepository _repository;

  public bool DisableCache => false;

  public GetAllEntriesQueryExecutor(IRepository repository)
  {
    _repository = repository;
  }

  public async Task<GetAllEntriesQueryResult> Execute(GetAllEntriesQuery query)
  {
    IJournal[] allJournals = await _repository.GetAllJournals(null, null, null, 100);
    string[] allJournalIds = allJournals.Select(j => j.Id!).ToArray();

    IEntry[] allEntries = await _repository.GetLastEditedEntries(
      allJournalIds,
      query.SearchText,
      query.JournalTypes,
      query.Limit ?? 20
    );

    string[] relevantJournalIds = allEntries.Select(e => e.ParentId).ToArray();

    return new GetAllEntriesQueryResult
    {
      Journals = allJournals.Where(j => relevantJournalIds.Contains(j.Id)).ToArray(),
      Entries = allEntries.ToArray()
    };
  }
}
