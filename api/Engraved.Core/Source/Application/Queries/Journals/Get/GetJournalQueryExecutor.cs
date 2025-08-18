using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Journals.Get;

public class GetJournalQueryExecutor(IUserScopedRepository repository) : IQueryExecutor<IJournal?, GetJournalQuery>
{
  public bool DisableCache => false;

  public async Task<IJournal?> Execute(GetJournalQuery query)
  {
    if (string.IsNullOrEmpty(query.JournalId))
    {
      throw new InvalidQueryException(query, $"{nameof(query.JournalId)} must be specified.");
    }

    IJournal? journal = await repository.GetJournal(query.JournalId);
    if (journal == null)
    {
      return null;
    }

    var journalWithEnsuredPermissions = await JournalQueryUtil.EnsurePermissionUsers(repository, journal);
    return journalWithEnsuredPermissions.First();
  }
}
