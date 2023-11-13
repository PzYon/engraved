using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Journals.Get;

public class GetJournalQueryExecutor : IQueryExecutor<IJournal?, GetJournalQuery>
{
  private readonly IUserScopedRepository _repository;

  public bool DisableCache => false;

  public GetJournalQueryExecutor(IUserScopedRepository repository)
  {
    _repository = repository;
  }

  public async Task<IJournal?> Execute(GetJournalQuery query)
  {
    if (string.IsNullOrEmpty(query.JournalId))
    {
      throw new InvalidQueryException(query!, $"{nameof(query.JournalId)} must be specified.");
    }

    IJournal? journal = await _repository.GetJournal(query.JournalId);
    if (journal == null)
    {
      return null;
    }

    IJournal[] journalWithEnsuredPermissions = await JournalQueryUtil.EnsurePermissionUsers(_repository, journal);
    return journalWithEnsuredPermissions.First();
  }
}
