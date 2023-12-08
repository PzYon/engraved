using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Journals.GetAll;

public class GetAllJournalsQueryExecutor(IUserScopedRepository repository)
  : IQueryExecutor<IJournal[], GetAllJournalsQuery>
{
  public bool DisableCache => false;

  public async Task<IJournal[]> Execute(GetAllJournalsQuery query)
  {
    IJournal[] allJournals = await repository.GetAllJournals(
      query.SearchText,
      query.JournalTypes,
      GetJournalIds(query),
      query.Limit
    );

    return await JournalQueryUtil.EnsurePermissionUsers(repository, allJournals);
  }

  private string[]? GetJournalIds(GetAllJournalsQuery query)
  {
    return !query.FavoritesOnly.HasValue || !query.FavoritesOnly.Value
      ? null
      : repository.CurrentUser.Value.FavoriteJournalIds.ToArray();
  }
}
