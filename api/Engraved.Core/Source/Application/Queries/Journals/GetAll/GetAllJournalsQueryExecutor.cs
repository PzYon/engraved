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
      query.ScheduledOnly ? ScheduleMode.CurrentUserOnly : ScheduleMode.None,
      query.JournalTypes,
      GetJournalIds(query),
      query.Limit,
      repository.CurrentUser.Value.Id
    );

    return await JournalQueryUtil.EnsurePermissionUsers(repository, allJournals);
  }

  private string[] GetJournalIds(GetAllJournalsQuery query)
  {
    var isFavoritesQuery = query.FavoritesOnly.HasValue && query.FavoritesOnly.Value;
    var queryFilterIds = query.JournalIds ?? [];

    if (!isFavoritesQuery)
    {
      return queryFilterIds;
    }

    return repository.CurrentUser.Value.FavoriteJournalIds
      .Where(i => !queryFilterIds.Any() || queryFilterIds.Contains(i))
      .ToArray();
  }
}
