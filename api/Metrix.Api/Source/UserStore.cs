using Metrix.Core.Domain.User;
using Microsoft.AspNetCore.Identity;

namespace Metrix.Api;

public class UserStore : IUserStore<IUser>
{
  public void Dispose()
  {
    throw new NotImplementedException();
  }

  public Task<string> GetUserIdAsync(IUser user, CancellationToken cancellationToken)
  {
    throw new NotImplementedException();
  }

  public Task<string> GetUserNameAsync(IUser user, CancellationToken cancellationToken)
  {
    throw new NotImplementedException();
  }

  public Task SetUserNameAsync(IUser user, string userName, CancellationToken cancellationToken)
  {
    throw new NotImplementedException();
  }

  public Task<string> GetNormalizedUserNameAsync(IUser user, CancellationToken cancellationToken)
  {
    throw new NotImplementedException();
  }

  public Task SetNormalizedUserNameAsync(IUser user, string normalizedName, CancellationToken cancellationToken)
  {
    throw new NotImplementedException();
  }

  public Task<IdentityResult> CreateAsync(IUser user, CancellationToken cancellationToken)
  {
    throw new NotImplementedException();
  }

  public Task<IdentityResult> UpdateAsync(IUser user, CancellationToken cancellationToken)
  {
    throw new NotImplementedException();
  }

  public Task<IdentityResult> DeleteAsync(IUser user, CancellationToken cancellationToken)
  {
    throw new NotImplementedException();
  }

  public Task<IUser> FindByIdAsync(string userId, CancellationToken cancellationToken)
  {
    throw new NotImplementedException();
  }

  public Task<IUser> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
  {
    throw new NotImplementedException();
  }
}
