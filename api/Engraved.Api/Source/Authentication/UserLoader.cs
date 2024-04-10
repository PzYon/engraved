using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;
using Microsoft.Extensions.Caching.Memory;

namespace Engraved.Api.Authentication;

public class UserLoader(IBaseRepository repository, IMemoryCache cache)
{
  private const string Users = "___users";

  private Dictionary<string, IUser> UsersByName => cache.GetOrCreate(Users, _ => new Dictionary<string, IUser>())!;

  public async Task<IUser> GetUser(string name)
  {
    if (UsersByName.TryGetValue(name, out IUser? cachedUser))
    {
      return cachedUser;
    }

    IUser? user = await repository.GetUser(name);

    UsersByName[name] = user ?? throw new NotAllowedOperationException($"Current user '{name}' does not exist.");

    return user;
  }

  public void SetUser(IUser user)
  {
    UsersByName[user.Name] = user;
  }
}
