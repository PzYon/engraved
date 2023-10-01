using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Journals.Get;

public class GetJournalQueryExecutor : IQueryExecutor<IJournal?>
{
  public bool DisableCache => false;

  private readonly GetJournalQuery _query;

  public GetJournalQueryExecutor(GetJournalQuery query)
  {
    _query = query;
  }

  public async Task<IJournal?> Execute(IRepository repository)
  {
    if (string.IsNullOrEmpty(_query.JournalId))
    {
      throw new InvalidQueryException<IJournal>(_query!, $"{nameof(_query.JournalId)} must be specified.");
    }

    IJournal? metric = await repository.GetJournal(_query.JournalId);
    if (metric == null)
    {
      return null;
    }

    IJournal[] metricWithEnsuredPermissions = await JournalQueryUtil.EnsurePermissionUsers(repository, metric);
    return metricWithEnsuredPermissions.First();
  }
}
