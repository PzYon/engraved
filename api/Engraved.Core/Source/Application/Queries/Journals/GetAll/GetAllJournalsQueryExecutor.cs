using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Journals.GetAll;

public class GetAllJournalsQueryExecutor : IQueryExecutor<IJournal[]>
{
  private readonly GetAllJournalsQuery _query;

  public GetAllJournalsQueryExecutor(GetAllJournalsQuery query)
  {
    _query = query;
  }

  public bool DisableCache => false;

  public async Task<IJournal[]> Execute(IRepository repository)
  {
    IJournal[] allJournals = await repository.GetAllJournals(_query.SearchText, _query.JournalTypes, _query.Limit);

    return await JournalQueryUtil.EnsurePermissionUsers(repository, allJournals);
  }
}
