using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Journals.Get;

public class GetJournalQueryExecutor(IJournalRepository journalRepository, IUserRepository userRepository)
  : IQueryExecutor<IJournal?, GetJournalQuery>
{
  public bool DisableCache => false;

  public async Task<IJournal?> Execute(GetJournalQuery query)
  {
    if (string.IsNullOrEmpty(query.JournalId))
    {
      throw new InvalidQueryException(query, $"{nameof(query.JournalId)} must be specified.");
    }

    IJournal? journal = await journalRepository.GetJournal(query.JournalId);
    if (journal == null)
    {
      return null;
    }

    var journalWithEnsuredPermissions = await JournalQueryUtil.EnsurePermissionUsers(userRepository, journal);
    return journalWithEnsuredPermissions.First();
  }
}
