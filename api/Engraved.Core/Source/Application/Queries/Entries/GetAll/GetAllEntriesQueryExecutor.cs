using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Entries.GetAll;

public class GetAllEntriesQueryExecutor(IRepository repository)
  : IQueryExecutor<GetAllEntriesQueryResult, GetAllEntriesQuery>
{
  public bool DisableCache => false;

  public async Task<GetAllEntriesQueryResult> Execute(GetAllEntriesQuery query)
  {
    IJournal[] allJournals = await repository.GetAllJournals(null, false, null, null, 100);
    string[] allJournalIds = allJournals.Select(j => j.Id!).ToArray();

    IEntry[] allEntries = await repository.GetLastEditedEntries(
      query.SearchText,
      query.ScheduledOnly,
      query.JournalTypes,
      allJournalIds,
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
