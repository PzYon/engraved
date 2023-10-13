using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Journals.GetAll;

public class GetAllJournalsQueryExecutor : IQueryExecutor<IJournal[], GetAllJournalsQuery>
{
  private readonly IRepository _repository;

  public GetAllJournalsQueryExecutor(IRepository repository)
  {
    _repository = repository;
  }

  public bool DisableCache => false;

  public async Task<IJournal[]> Execute(GetAllJournalsQuery query)
  {
    IJournal[] allJournals = await _repository.GetAllJournals(query.SearchText, query.JournalTypes, query.Limit);

    return await JournalQueryUtil.EnsurePermissionUsers(_repository, allJournals);
  }
}
