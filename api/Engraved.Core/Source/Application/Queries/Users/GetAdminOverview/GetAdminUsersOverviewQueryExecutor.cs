using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Queries.Users.GetAdminOverview;

public class GetAdminUsersOverviewQueryExecutor(IUnrestrictedRepository unrestrictedRepository)
  : IQueryExecutor<AdminUserOverview[], GetAdminUsersOverviewQuery>
{
  // admin data must always be current - a stale view could hide a just-deleted user's freed-up data
  // or omit someone who just signed up
  public bool DisableCache => true;

  public async Task<AdminUserOverview[]> Execute(GetAdminUsersOverviewQuery query)
  {
    IUser[] users = await unrestrictedRepository.GetAllUsers();

    var overview = new List<AdminUserOverview>();

    foreach (var user in users)
    {
      overview.Add(
        new AdminUserOverview
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

    return overview.ToArray();
  }
}
