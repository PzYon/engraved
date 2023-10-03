using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Entries.GetAll;

public class GetAllEntriesQueryExecutor : IQueryExecutor<GetAllEntriesQueryResult>
{
  public bool DisableCache => false;

  private readonly GetAllEntriesQuery _query;

  public GetAllEntriesQueryExecutor(GetAllEntriesQuery query)
  {
    _query = query;
  }

  public async Task<GetAllEntriesQueryResult> Execute(IRepository repository)
  {
    IJournal[] allJournals = await repository.GetAllJournals(null, null, 100);
    string[]? allJournalIds = allJournals.Select(j => j.Id!).ToArray();

    IEntry[] allEntries = await repository.GetLastEditedEntries(
      allJournalIds,
      _query.SearchText,
      _query.JournalTypes,
      _query.Limit ?? 20
    );

    string[] relevantJournalIds = allEntries.Select(e => e.ParentId).ToArray();

    return new GetAllEntriesQueryResult
    {
      Journals = allJournals.Where(j => relevantJournalIds.Contains(j.Id)).ToArray(),
      Entries = allEntries.ToArray()
    };
  }
}
