using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Activities.Get;

public class GetActivitiesQueryExecutor : IQueryExecutor<GetActivitiesQueryResult>
{
  public bool DisableCache => false;

  private readonly GetActivitiesQuery _query;

  public GetActivitiesQueryExecutor(GetActivitiesQuery query)
  {
    _query = query;
  }

  public async Task<GetActivitiesQueryResult> Execute(IRepository repository)
  {
    IJournal[] allJournals = await repository.GetAllJournals(null, null, 100);
    string[]? allJournalIds = allJournals.Select(j => j.Id!).ToArray();

    IEntry[] allEntries = await repository.GetLastEditedEntries(
      allJournalIds,
      _query.SearchText,
      _query.JournalTypes,
      _query.Limit ?? 20
    );

    string[] relevantJournalIds = allEntries.Select(j => j.ParentId).ToArray();

    return new GetActivitiesQueryResult
    {
      Journals = allJournals.Where(j => relevantJournalIds.Contains(j.Id)).ToArray(),
      Entries = allEntries.ToArray()
    };
  }
}
