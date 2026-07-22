using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Queries.Users.GetAdminOverview;

public class GetAdminUsersOverviewQueryExecutor(IUnrestrictedRepository unrestrictedRepository)
  : IQueryExecutor<AdminUserItem[], GetAdminUsersOverviewQuery>
{
  // admin data must always be current - a stale view could hide a just-deleted user's freed-up data
  // or omit someone who just signed up
  public bool DisableCache => true;

  public async Task<AdminUserItem[]> Execute(GetAdminUsersOverviewQuery query)
  {
    IUser[] users = await unrestrictedRepository.GetAllUsers();

    var items = new List<AdminUserItem>();

    foreach (var user in users)
    {
      items.Add(
        new AdminUserItem
        {
          Id = user.Id!,
          Name = user.Name,
          DisplayName = user.DisplayName,
          JournalsCount = await unrestrictedRepository.CountJournalsForUser(user.Id!),
          EntriesCount = await unrestrictedRepository.CountEntriesForUser(user.Id!),
          LastLoginDate = user.LastLoginDate
        }
      );
    }

    // most recently active users first; users who never logged in (LastLoginDate null) sort last
    return items
      .OrderByDescending(i => i.LastLoginDate ?? DateTime.MinValue)
      .ToArray();
  }
}
