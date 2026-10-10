using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Queries.Users.GetScratchpad;

public class GetScratchpadQueryExecutor(Lazy<IUser> currentUser) : IQueryExecutor<UserScratchpad?, GetScratchpadQuery>
{
  public bool DisableCache => true;

  public Task<UserScratchpad?> Execute(GetScratchpadQuery query)
  {
    return Task.FromResult(currentUser.Value.Scratchpad);
  }
}
