using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Journals.GetAll;

public class GetAllJournalsQueryExecutor : IQueryExecutor<IJournal[], GetAllJournalsQuery>
{
  private readonly IRepository _repository;
  private readonly IUserScopedRepository _userScopedRepository;

  public GetAllJournalsQueryExecutor(IRealRepository repository, IUserScopedRepository userScopedRepository)
  {
    _repository = repository;
    _userScopedRepository = userScopedRepository;
  }

  public bool DisableCache => false;

  public async Task<IJournal[]> Execute(GetAllJournalsQuery query)
  {
    IJournal[] allJournals = await _repository.GetAllJournals(
      query.SearchText,
      query.JournalTypes,
      GetJournalIds(query),
      query.Limit
    );

    return await JournalQueryUtil.EnsurePermissionUsers(_repository, allJournals);
  }

  private string[]? GetJournalIds(GetAllJournalsQuery query)
  {
    return !query.FavoritesOnly.HasValue || !query.FavoritesOnly.Value
      ? null
      : _userScopedRepository.CurrentUser.Value.FavoriteJournalIds.ToArray();
  }
}
